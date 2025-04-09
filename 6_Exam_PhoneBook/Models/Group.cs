using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace _6_Exam_PhoneBook.Models;

[Table("groups")]
public partial class Group
{
    [Key]
    [Column("group_id")]
    public int GroupId { get; set; }

    [Column("owner_id")]
    public int OwnerId { get; set; }

    [Column("name")]
    [StringLength(100)]
    public string Name { get; set; } = null!;

    [InverseProperty("Group")]
    public virtual ICollection<Contact> Contacts { get; set; } = new List<Contact>();
}
