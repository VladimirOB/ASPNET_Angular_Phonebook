using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using _6_Exam_PhoneBook.Models;

namespace _6_Exam_PhoneBook.Data;

public partial class NgExamPhoneBookContext : DbContext
{
    public NgExamPhoneBookContext()
    {
    }

    public NgExamPhoneBookContext(DbContextOptions<NgExamPhoneBookContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Contact> Contacts { get; set; }

    public virtual DbSet<Group> Groups { get; set; }

    public virtual DbSet<Number> Numbers { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) { }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Contact>(entity =>
        {
            entity.HasKey(e => e.ConId).HasName("PK__contacts__081B0F1A44FF1D90");

            entity.HasOne(d => d.Group).WithMany(p => p.Contacts)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_contacts_groups");
        });

        modelBuilder.Entity<Group>(entity =>
        {
            entity.HasKey(e => e.GroupId).HasName("PK__groups__D57795A00993101B");
        });

        modelBuilder.Entity<Number>(entity =>
        {
            entity.HasKey(e => e.NumId).HasName("PK__numbers__FCEB8F7651AC9E8E");

            entity.HasOne(d => d.Con).WithMany(p => p.Numbers)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("FK__numbers__con_id__38996AB5");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__users__B9BE370FDAA735B1");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
