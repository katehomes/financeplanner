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

            // ✅ Update basic fields
            existingTransaction.Amount = transaction.Amount;
            existingTransaction.Date = transaction.Date.ToUniversalTime();
            existingTransaction.Description = transaction.Description;
            existingTransaction.CategoryId = transaction.CategoryId;

            // ✅ Handle Tags: Clear and replace with resolved list
            existingTransaction.Tags.Clear();

            foreach (var tag in transaction.Tags ?? new List<Tag>())
            {
                var existingTag = await _context.Tags
                    .FirstOrDefaultAsync(t => t.Name.ToLower() == tag.Name.ToLower());

                if (existingTag != null)
                {
                    existingTransaction.Tags.Add(existingTag);
                }
                else
                {
                    var newTag = new Tag { Name = tag.Name };
                    _context.Tags.Add(newTag);
                    existingTransaction.Tags.Add(newTag);
                }
            }

            await _context.SaveChangesAsync();

            // ✅ Re-fetch with updated tags + category
            var updated = await _context.Transactions
                .Include(t => t.Category)
                .Include(t => t.Tags)
                .FirstOrDefaultAsync(t => t.Id == id);

            return Ok(updated);
        }

        // POST: api/Transaction
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Transaction>> PostTransaction(Transaction transaction)
        {
            transaction.Date = transaction.Date.ToUniversalTime();
            
            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTransaction), new { id = transaction.Id }, transaction);
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
    }
}
