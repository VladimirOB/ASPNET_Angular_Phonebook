using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace _6_Exam_PhoneBook.Models;

[Table("users")]
[Index("Login", Name = "UQ__users__7838F27285784037", IsUnique = true)]
public partial class User
{
    [Key]
    [Column("user_id")]
    public int UserId { get; set; }

    [Column("login")]
    [StringLength(16)]
    public string? Login { get; set; }

    [Column("password")]
    [StringLength(64)]
    public string? Password { get; set; }
}
