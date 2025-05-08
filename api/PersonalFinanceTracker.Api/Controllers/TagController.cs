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
    [Route("api/tag")]
    [ApiController]
    public class TagController : ControllerBase
    {
        private readonly FinanceContext _context;

        public TagController(FinanceContext context)
        {
            _context = context;
        }

        // GET: api/Tag
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Tag>>> GetTag()
        {
            var tags = await _context.Tags
                .Include(t => t.TransactionTags)
                    .ThenInclude(tt => tt.Transaction)
                .OrderBy(t => t.Id)
                .ToListAsync();

            PopulateTransactions(tags);

            return tags;
        }

        // GET: api/Tag/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Tag>> GetTag(int id)
        {
            var tag = await _context.Tags.FirstOrDefaultAsync(t => t.Id == id);

            if (tag == null)
            {
                return NotFound();
            }

            return tag;
        }

        // PUT: api/Tag/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTag(int id, Tag tag)
        {
            if (id != tag.Id)
            {
                return BadRequest();
            }

            _context.Entry(tag).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TagExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            var updated = await _context.Tags.FirstOrDefaultAsync(t => t.Id == id);

            return Ok(updated);
        }

        // POST: api/Tag
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Tag>> PostTag(Tag tag)
        {
            if (!string.IsNullOrWhiteSpace(tag.Name))
            {
                var lowerName = tag.Name.ToLower();
                var byName = await _context.Tags
                    .FirstOrDefaultAsync(t => t.Name.ToLower() == lowerName);

                if (byName != null)
                    return StatusCode(403, $"Tag Already Exists: [{lowerName}]");
            }

            tag.Id = 0;

            _context.Tags.Add(tag);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTag", new { id = tag.Id }, tag);
        }

        // DELETE: api/Tag/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTag(int id)
        {
            var tag = await _context.Tags.FindAsync(id);
            if (tag == null)
            {
                return NotFound();
            }

            _context.Tags.Remove(tag);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TagExists(int id)
        {
            return _context.Tags.Any(e => e.Id == id);
        }

        private void PopulateTransactions(IEnumerable<Tag> tags)
        {
            foreach (var tag in tags)
            {
                tag.Transactions = tag.TransactionTags.Select(tt => tt.Transaction).ToList();
            }
        }
    }
}
