using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PersonalFinanceTracker.Api.Data;
using PersonalFinanceTracker.Api.Models;

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
            return await _context.Transactions
                .Include(t => t.Category)
                .Include(t => t.Tags)
                .OrderBy(t => t.Id)
                .ToListAsync();
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
                .Include(t => t.Tags)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (existingTransaction == null)
                return NotFound();

            // Update scalar fields
            existingTransaction.Amount = transaction.Amount;
            existingTransaction.Date = transaction.Date.ToUniversalTime();
            existingTransaction.Description = transaction.Description;
            existingTransaction.CategoryId = transaction.CategoryId;

            existingTransaction.TransactionTags = new List<TransactionTag>();

            foreach (var tag in transaction.Tags ?? new List<Tag>())
            {
                var resolved = await ResolveTagAsync(tag);
                existingTransaction.TransactionTags.Add(new TransactionTag
                {
                    Tag = resolved,
                    Transaction = existingTransaction
                });
            }

            // Clear the incoming transaction.Tags (it's not tracked by EF)
            transaction.Tags = null;

            await _context.SaveChangesAsync();

            // Re-fetch transaction with joined tags and category
            var updated = await _context.Transactions
                .Include(t => t.Category)
                .Include(t => t.TransactionTags)
                    .ThenInclude(tt => tt.Tag)
                .FirstOrDefaultAsync(t => t.Id == existingTransaction.Id);

            if (updated != null)
            {
                // Populate .Tags from .TransactionTags
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

    }
}
