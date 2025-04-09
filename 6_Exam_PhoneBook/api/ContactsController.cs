using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using _6_Exam_PhoneBook.Data;
using _6_Exam_PhoneBook.Models;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using _6_Exam_PhoneBook.DTOs;
using _6_Exam_AspApiReact_Contacts.DTOs;

namespace _6_Exam_PhoneBook.api
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactsController : ControllerBase
    {
        private readonly NgExamPhoneBookContext _context;

        public ContactsController(NgExamPhoneBookContext context)
        {
            _context = context;
        }

        // GET: api/Contacts

        [HttpGet("all/{ownerId}")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Contact>>> GetContacts(int ownerId)
        {
            if (_context.Contacts == null)
            {
                return NotFound();
            }
            var res = await (from c in _context.Contacts
                             where c.OwnerId == ownerId
                             select new Contact
                             {
                                 ConId = c.ConId,
                                 OwnerId = c.OwnerId,
                                 Name = c.Name,
                                 Address = c.Address,
                                 Email = c.Email,
                                 GroupId = c.GroupId,
                                 Group = c.Group,
                                 Numbers = c.Numbers
                             }).ToListAsync();
            return res;
        }

        // GET: api/Contacts/5
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<Contact>> GetContact(int id)
        {
            if (_context.Contacts == null)
            {
                return NotFound();
            }
            //var contact = await _context.Contacts.FindAsync(id);
            var contact = await (from c in _context.Contacts
                             where c.ConId == id
                             select new Contact
                             {
                                 ConId = c.ConId,
                                 OwnerId = c.OwnerId,
                                 Name = c.Name,
                                 Address = c.Address,
                                 Email = c.Email,
                                 GroupId = c.GroupId,
                                 Group = c.Group,
                                 Numbers = c.Numbers
                             }).FirstOrDefaultAsync();

            if (contact == null)
            {
                return NotFound();
            }

            return contact;
        }

        // PUT: api/Contacts/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> PutContact(int id, ContactDTO contact)
        {
            if (id != contact.ConId)
            {
                return BadRequest();
            }
            Contact newContact = new Contact()
            {
                ConId = contact.ConId,
                OwnerId = contact.OwnerId,
                Name = contact.Name,
                Address = contact.Address,
                GroupId = contact.GroupId,
                Email = contact.Email,
                Numbers = contact.Numbers
            };

            _context.Entry(newContact).State = EntityState.Modified;
            List<Number> nums = new List<Number>(newContact.Numbers);
            for (int i = 0; i < nums.Count; i++)
            {
                //если пришел пустой номер - удалить из базы
                if (nums[i].Number1.Length == 0)
                {
                    var numInBase = await _context.Numbers.FindAsync(nums[i].NumId);
                    if (numInBase != null)
                    {
                        _context.Numbers.Remove(numInBase);
                        newContact.Numbers.Remove(nums[i]);
                        continue;
                    }
                }
                else
                {
                    //если номер изменён
                    if (nums[i].ConId != 0)
                        _context.Entry(nums[i]).State = EntityState.Modified;
                    else
                    {
                        //новый номер
                        nums[i].Con = newContact;
                        _context.Entry(nums[i]).State = EntityState.Added;
                    }
                }
            }
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ContactExists(id))
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

        // POST: api/Contacts
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> PostContact(ContactDTO contact)
        {
            if (_context.Contacts == null)
            {
                return Problem("Entity set 'NgExamPhoneBookContext.Contacts'  is null.");
            }
            Contact newContact = new Contact()
            {
                OwnerId = contact.OwnerId,
                Name = contact.Name,
                Address = contact.Address,
                ConId = contact.ConId,
                GroupId = contact.GroupId,
                Email = contact.Email,
                Numbers = contact.Numbers
            };
            await _context.Contacts.AddAsync(newContact);
            await _context.SaveChangesAsync();
            return Ok();
            //return CreatedAtAction("GetContact", new { id = contact.ConId }, newContact);
        }

        [HttpDelete]
        [Authorize]
        public async Task<ActionResult> DeleteContacts(IndicesDTO indices)
        {
            if (indices == null)
            {
                return NotFound();
            }
            foreach (var id in indices.ids)
            {
                var contact = await _context.Contacts.FindAsync(id);
                if(contact != null)
                    _context.Contacts.Remove(contact);
            }
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool ContactExists(int id)
        {
            return (_context.Contacts?.Any(e => e.ConId == id)).GetValueOrDefault();
        }
    }
}
