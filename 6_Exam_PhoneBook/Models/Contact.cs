using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace _6_Exam_PhoneBook.Models;

[Table("contacts")]
public partial class Contact
{
    [Key]
    [Column("con_id")]
    public int ConId { get; set; }

    [Column("owner_id")]
    public int OwnerId { get; set; }

    [Column("name")]
    [StringLength(100)]
    public string Name { get; set; } = null!;

    [Column("group_id")]
    public int GroupId { get; set; }

    [Column("email")]
    [StringLength(100)]
    public string? Email { get; set; }

    [Column("address")]
    [StringLength(100)]
    public string? Address { get; set; }

    [ForeignKey("GroupId")]
    [InverseProperty("Contacts")]
    public virtual Group Group { get; set; } = null!;

    [InverseProperty("Con")]
    public virtual ICollection<Number> Numbers { get; set; } = new List<Number>();
}
