using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace _6_Exam_PhoneBook.Models;

[Table("numbers")]
public partial class Number
{
    [Key]
    [Column("num_id")]
    public int NumId { get; set; }

    [Column("con_id")]
    public int? ConId { get; set; }

    [Column("number")]
    [StringLength(16)]
    public string Number1 { get; set; } = null!;

    [ForeignKey("ConId")]
    [InverseProperty("Numbers")]
    public virtual Contact? Con { get; set; }
}
