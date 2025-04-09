using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using _6_Exam_PhoneBook.Data;
using _6_Exam_PhoneBook.Models;
using Microsoft.AspNetCore.Authorization;
using _6_Exam_AspApiReact_Contacts.DTOs;

namespace _6_Exam_PhoneBook.api
{
    [Route("api/[controller]")]
    [ApiController]
    public class GroupsController : ControllerBase
    {
        private readonly NgExamPhoneBookContext _context;

        public GroupsController(NgExamPhoneBookContext context)
        {
            _context = context;
        }

        // GET: api/Groups
        [HttpGet("all/{ownerId}")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Group>>> GetGroups(int ownerId)
        {
          if (_context.Groups == null)
          {
              return NotFound();
          }
            var res = await (from c in _context.Groups
                             where c.OwnerId == ownerId
                             select new Group
                             {
                                 GroupId = c.GroupId,
                                 OwnerId = c.OwnerId,
                                 Name = c.Name,
                                 Contacts = c.Contacts
                                 
                             }).ToListAsync();
            return res;
        }

        // GET: api/Groups/5
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<Group>> GetGroup(int id)
        {
          if (_context.Groups == null)
          {
              return NotFound();
          }
            var @group = await _context.Groups.FindAsync(id);

            if (@group == null)
            {
                return NotFound();
            }

            return @group;
        }

        // PUT: api/Groups/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> PutGroup(int id, Group @group)
        {
            if (id != @group.GroupId)
            {
                return BadRequest();
            }

            _context.Entry(@group).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!GroupExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Groups
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Group>> PostGroup(Group @group)
        {
          if (_context.Groups == null)
          {
              return Problem("Entity set 'NgExamPhoneBookContext.Groups'  is null.");
          }
            _context.Groups.Add(@group);
            await _context.SaveChangesAsync();

            //return Ok();
            return CreatedAtAction("GetGroup", new { id = @group.GroupId }, @group);
        }

        [HttpDelete]
        [Authorize]
        public async Task<ActionResult> DeleteGroups(IndicesDTO indices)
        {
            if (indices == null)
            {
                return NotFound();
            }
            foreach (var id in indices.ids)
            {
                var contact = await _context.Groups.FindAsync(id);
                if (contact != null)
                    _context.Groups.Remove(contact);
            }
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool GroupExists(int id)
        {
            return (_context.Groups?.Any(e => e.GroupId == id)).GetValueOrDefault();
        }
    }
}
