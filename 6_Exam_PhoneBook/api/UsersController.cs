using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using _6_Exam_PhoneBook.Data;
using _6_Exam_PhoneBook.Models;
using _6_Exam_PhoneBook.DTOs;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using _6_Exam_AspApiReact_Contacts.DTOs;

namespace _6_Exam_PhoneBook.api
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly NgExamPhoneBookContext _context;

        private readonly IConfiguration _configuration;

        public UsersController(NgExamPhoneBookContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [Route("login")]
        [HttpPost]

        public async Task<ActionResult> Login([FromBody] LoginDTO dto)
        {
            User? user = await _context.Users.Where(u => u.Login == dto.login && u.Password == dto.password).FirstOrDefaultAsync();
            if (user == null)
                return Unauthorized();

            var guid = Guid.NewGuid().ToString();
            // https://datatracker.ietf.org/doc/html/rfc7519#section-4
            var claims = new List<Claim> {
                new Claim(JwtRegisteredClaimNames.Sub, user.Login),
                new Claim(JwtRegisteredClaimNames.Jti, guid),
                new Claim(ClaimTypes.Name, user.Login)
            };

            var signingKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["Jwt:SigningKey"]!));

            int expiryInMinutes = Convert.ToInt32(_configuration["Jwt:ExpiryInMinutes"]);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Site"],
                audience: _configuration["Jwt:Site"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(expiryInMinutes),
                signingCredentials: new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256)
            );
            return Ok(
                new
                {
                    access_token = new JwtSecurityTokenHandler().WriteToken(token),
                    userId = user.UserId,
                    expiration = token.ValidTo
                });
        }

        [Route("reg")]
        [HttpPost]
        public async Task<ActionResult> Registration([FromBody] LoginDTO dto)
        {
            var user = await _context.Users.Where(u => u.Login == dto.login).FirstOrDefaultAsync();
            if (user != null)
                return Ok(new { already = true });
            try
            {
                _context.Users.Add(new User() { Login = dto.login, Password = dto.password });
                await _context.SaveChangesAsync();
                return Ok(new { already = false });
            }
            catch
            {
                return BadRequest();
            }

        }

        // GET: api/Users
        [HttpGet]
        [Authorize(Policy = "AdminPolicy")]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
          if (_context.Users == null)
          {
              return NotFound();
          }
            return await _context.Users.ToListAsync();
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
          if (_context.Users == null)
          {
              return NotFound();
          }
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // PUT: api/Users/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, User user)
        {
            if (id != user.UserId)
            {
                return BadRequest();
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
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

        // POST: api/Users
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(User user)
        {
          if (_context.Users == null)
          {
              return Problem("Entity set 'NgExamPhoneBookContext.Users'  is null.");
          }
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUser", new { id = user.UserId }, user);
        }

        [HttpDelete]
        [Authorize(Policy = "AdminPolicy")]
        public async Task<ActionResult> DeleteUsers(IndicesDTO indices)
        {
            if (indices == null)
            {
                return NotFound();
            }
            foreach (var id in indices.ids)
            {
                var contact = await _context.Users.FindAsync(id);
                if (contact != null)
                    _context.Users.Remove(contact);
            }
            await _context.SaveChangesAsync();
            return NoContent();
        }

        private bool UserExists(int id)
        {
            return (_context.Users?.Any(e => e.UserId == id)).GetValueOrDefault();
        }
    }
}
