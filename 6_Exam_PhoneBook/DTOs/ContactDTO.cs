using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using _6_Exam_PhoneBook.Models;

namespace _6_Exam_PhoneBook.DTOs
{
    public class ContactDTO
    {
        public int ConId { get; set; }
        public int OwnerId { get; set; }
        public string Name { get; set; } = null!;
        public int GroupId { get; set; }
        public string? Email { get; set; }
        public string? Address { get; set; }
        public string? Group { get; set; }
        //public ICollection<string> Numbers { get; set; } = new List<string>();
        public ICollection<Number> Numbers { get; set; } = new List<Number>();
    }
}
