using System;
using System.Globalization;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PersonalFinanceTracker.Api.Data;
using PersonalFinanceTracker.Api.Models;
using PersonalFinanceTracker.Api.DTOs;
using CsvHelper;
using CsvHelper.Configuration;

namespace PersonalFinanceTracker.Api.Controllers
{
    [Route("api/transaction")]
    [ApiController]
    public class TransactionsController : ControllerBase
    {
        private readonly FinanceContext _context;

        public TransactionsController(FinanceContext context)
        {
            _context = context;
        }

        // GET: api/Transaction/
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Transaction>>> GetTransaction()
        {
            var transactions = await _context.Transactions
                .Include(t => t.Category)
                .Include(t => t.TransactionTags)
                    .ThenInclude(tt => tt.Tag)
                .OrderBy(t => t.Id)
                .ToListAsync();

            PopulateTags(transactions);

            return transactions;
        }

        // GET: api/Transaction/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Transaction>> GetTransaction(int id)
        {
            var transaction = await _context.Transactions
                .Include(t => t.Category)
                .Include(t => t.Tags)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (transaction == null)
            {
                return NotFound();
            }

            PopulateTags([transaction]);

            return transaction;
        }

        // PUT: api/Transaction/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTransaction(int id, Transaction transaction)
        {
            if (id != transaction.Id)
                return BadRequest();

            var existingTransaction = await _context.Transactions
                .Include(t => t.TransactionTags)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (existingTransaction == null)
                return NotFound();

            existingTransaction.Amount = transaction.Amount;
            existingTransaction.Date = transaction.Date.ToUniversalTime();
            existingTransaction.Description = transaction.Description;
            existingTransaction.CategoryId = transaction.CategoryId;

            var incomingTagIds = (transaction.Tags ?? new List<Tag>()).Select(t => t.Id).ToHashSet();
            var existingTagIds = existingTransaction.TransactionTags.Select(tt => tt.TagId).ToHashSet();

            existingTransaction.TransactionTags = existingTransaction.TransactionTags
                .Where(tt => incomingTagIds.Contains(tt.TagId))
                .ToList();

            var newTagIds = incomingTagIds.Except(existingTagIds);
            foreach (var tagId in newTagIds)
            {
                existingTransaction.TransactionTags.Add(new TransactionTag
                {
                    TransactionId = id,
                    TagId = tagId
                });
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(500, $"Error saving transaction: {ex.InnerException?.Message ?? ex.Message}");
            }

            var updated = await _context.Transactions
                .Include(t => t.Category)
                .Include(t => t.TransactionTags).ThenInclude(tt => tt.Tag)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (updated != null)
            {
                updated.Tags = updated.TransactionTags.Select(tt => tt.Tag).ToList();
            }

            return Ok(updated);
        }


        // POST: api/Transaction
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Transaction>> PostTransaction(Transaction transaction)
        {
            transaction.Date = transaction.Date.ToUniversalTime();

            transaction.TransactionTags = new List<TransactionTag>();

            foreach (var tag in transaction.Tags ?? new List<Tag>())
            {
                var resolved = await ResolveTagAsync(tag);
                transaction.TransactionTags.Add(new TransactionTag
                {
                    Tag = resolved,
                    Transaction = transaction
                });
            }

            // Clear the incoming transaction.Tags (it's not tracked by EF)
            transaction.Tags = null;

            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();

            // Re-fetch transaction with joined tags and category
            var created = await _context.Transactions
                .Include(t => t.Category)
                .Include(t => t.TransactionTags)
                    .ThenInclude(tt => tt.Tag)
                .FirstOrDefaultAsync(t => t.Id == transaction.Id);

            if (created != null)
            {
                // Populate .Tags from .TransactionTags
                created.Tags = created.TransactionTags.Select(tt => tt.Tag).ToList();
            }

            return CreatedAtAction(nameof(GetTransaction), new { id = created?.Id }, created);
        }

        // DELETE: api/Transaction/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTransaction(int id)
        {
            var transaction = await _context.Transactions.FindAsync(id);
            if (transaction == null)
            {
                return NotFound();
            }

            _context.Transactions.Remove(transaction);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TransactionExists(int id)
        {
            return _context.Transactions.Any(e => e.Id == id);
        }

        private async Task<Tag> ResolveTagAsync(Tag inputTag)
        {
            // 1. Try by Id
            if (inputTag.Id != 0)
            {
                var byId = await _context.Tags.FindAsync(inputTag.Id);
                if (byId != null)
                    return byId;
            }

            // 2. Try by name (case-insensitive)
            if (!string.IsNullOrWhiteSpace(inputTag.Name))
            {
                var lowerName = inputTag.Name.ToLower();
                var byName = await _context.Tags
                    .FirstOrDefaultAsync(t => t.Name.ToLower() == lowerName);

                if (byName != null)
                    return byName;
            }

            // 3. Create new tag
            var newTag = new Tag
            {
                Name = inputTag.Name.Trim(),
                Color = inputTag.Color
            };

            _context.Tags.Add(newTag); // Track it so EF inserts it on SaveChanges
            return newTag;
        }




        // POST: api/transaction/batch/set-category
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("batch/set-category")]
        public async Task<IActionResult> SetCategoryForTransactions([FromBody] BatchSetCategoryRequest request)
        {
            if (request.Ids == null || request.Ids.Count == 0)
                return BadRequest("No transaction IDs provided.");

            // Optional: validate categoryId if not null
            if (request.CategoryId != null)
            {
                var categoryExists = await _context.Categories.AnyAsync(c => c.Id == request.CategoryId);
                if (!categoryExists)
                    return NotFound($"Category with ID {request.CategoryId} not found.");
            }

            var transactions = await _context.Transactions
                .Where(t => request.Ids.Contains(t.Id))
                .ToListAsync();

            if (transactions.Count == 0)
                return NotFound("No matching transactions found.");

            foreach (var tx in transactions)
            {
                tx.CategoryId = request.CategoryId;
            }

            await _context.SaveChangesAsync();
            return Ok(new { updated = transactions.Count });
        }

        // POST: api/transaction/batch/add-tag
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("batch/remove-tags")]
        public async Task<IActionResult> RemoveTagsFromTransactions([FromBody] BatchAlterTagsRequest request)
        {
            if (request.Ids == null || request.Ids.Count == 0 || request.TagIds == null || request.TagIds.Count == 0)
                return BadRequest("Transaction IDs and Tag IDs are required.");

            var transactions = await _context.Transactions
                .Include(t => t.TransactionTags)
                .Where(t => request.Ids.Contains(t.Id))
                .ToListAsync();

            if (transactions.Count == 0)
                return NotFound("No matching transactions found.");

            var tagsToRemove = await _context.Tags
                .Where(t => request.TagIds.Contains(t.Id))
                .ToListAsync();

            if(tagsToRemove.Count == 0)
            return NotFound("No matching tagsToRemove found.");

            foreach (var tx in transactions)
            {
                foreach (var tag in tagsToRemove)
                {
                    TransactionTag? existingTag = tx.TransactionTags.FirstOrDefault(tt => tt.TagId == tag.Id);
                    if (existingTag != null)
                    {
                        tx.TransactionTags.Remove(existingTag);
                    }
                }
            }

            await _context.SaveChangesAsync();

            return Ok(new { updated = transactions.Count, tagsAdded = tagsToRemove.Count });
        }


        // POST: api/transaction/batch/remove-tag
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("batch/add-tags")]
        public async Task<IActionResult> AddTagsToTransactions([FromBody] BatchAlterTagsRequest request)
        {
            if (request.Ids == null || request.Ids.Count == 0 || request.TagIds == null || request.TagIds.Count == 0)
                return BadRequest("Transaction IDs and Tag IDs are required.");

            var transactions = await _context.Transactions
                .Include(t => t.TransactionTags)
                .Where(t => request.Ids.Contains(t.Id))
                .ToListAsync();

            if (transactions.Count == 0)
                return NotFound("No matching transactions found.");

            var tags = await _context.Tags
                .Where(t => request.TagIds.Contains(t.Id))
                .ToListAsync();

            if(tags.Count == 0)
            return NotFound("No matching tags found.");

            foreach (var tx in transactions)
            {
                foreach (var tag in tags)
                {
                    bool alreadyTagged = tx.TransactionTags.Any(tt => tt.TagId == tag.Id);
                    if (!alreadyTagged)
                    {
                        tx.TransactionTags.Add(new TransactionTag
                        {
                            TransactionId = tx.Id,
                            TagId = tag.Id
                        });
                    }
                }
            }

            await _context.SaveChangesAsync();

            return Ok(new { updated = transactions.Count, tagsAdded = tags.Count });
        }

        private void PopulateTags(IEnumerable<Transaction> transactions)
        {
            foreach (var tx in transactions)
            {
                tx.Tags = tx.TransactionTags.Select(tt => tt.Tag).ToList();
            }
        }


        [HttpPost("import/preview")] //(CSV → JSON)
        public async Task<ActionResult<List<TransactionImportRow>>> PreviewImport([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("File is required.");

            using var stream = file.OpenReadStream();
            using var reader = new StreamReader(stream);
            using var csv = new CsvReader(reader, new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                TrimOptions = TrimOptions.Trim,
                HeaderValidated = null,
                MissingFieldFound = null
            });

            csv.Context.RegisterClassMap<TransactionImportRowMap>();

            try
            {
                var rows = csv.GetRecords<TransactionImportRow>().ToList();
                return Ok(rows);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error parsing CSV: {ex.Message}");
            }
        }

        [HttpPost("import/confirm")] //(JSON → DB)
        public async Task<IActionResult> ConfirmImport([FromBody] List<Transaction> transactions)
        {
            if (transactions == null || transactions.Count == 0)
                return BadRequest("No transactions provided.");

            foreach (var tx in transactions)
            {
                tx.Date = tx.Date.ToUniversalTime();

                // --- CATEGORY ---
                if (tx.Category != null && !string.IsNullOrWhiteSpace(tx.Category.Name))
                {
                    var existingCat = await _context.Categories
                        .FirstOrDefaultAsync(c => c.Name.ToLower() == tx.Category.Name.ToLower());

                    if (existingCat != null)
                    {
                        tx.CategoryId = existingCat.Id;
                    }
                    else
                    {
                        var newCat = new Category { Name = tx.Category.Name.Trim() };
                        _context.Categories.Add(newCat);
                        await _context.SaveChangesAsync(); // Save to get ID
                        tx.CategoryId = newCat.Id;
                    }
                }

                // Reset navigation property
                tx.Category = null;

                // --- TAGS ---
                tx.TransactionTags = new List<TransactionTag>();
                foreach (var tag in tx.Tags ?? new List<Tag>())
                {
                    if (string.IsNullOrWhiteSpace(tag.Name)) continue;

                    var existingTag = await _context.Tags
                        .FirstOrDefaultAsync(t => t.Name.ToLower() == tag.Name.ToLower());

                    Tag resolvedTag;
                    if (existingTag != null)
                    {
                        resolvedTag = existingTag;
                    }
                    else
                    {
                        resolvedTag = new Tag
                        {
                            Name = tag.Name.Trim(),
                            Color = tag.Color ?? "#888",
                            Border = tag.Border,
                            Text = tag.Text ?? "white"
                        };
                        _context.Tags.Add(resolvedTag);
                        await _context.SaveChangesAsync(); // Save to get ID
                    }

                    tx.TransactionTags.Add(new TransactionTag
                    {
                        TagId = resolvedTag.Id
                    });
                }

                tx.Tags = null;
                _context.Transactions.Add(tx);
            }

            await _context.SaveChangesAsync();
            return Ok(new { imported = transactions.Count });
        }


    }
}
