using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    public class BackendContext : DbContext
    {
        public BackendContext(DbContextOptions<BackendContext> options)
            : base(options)
        {
        }

        // DbSets for all models
        public DbSet<User> Users { get; set; }
        public DbSet<Story> Stories { get; set; }
        public DbSet<Character> Characters { get; set; }
        public DbSet<CharacterRelationship> CharacterRelationships { get; set; }
        public DbSet<StoryPart> StoryParts { get; set; }
        public DbSet<StoryPartCharacter> StoryPartCharacters { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<StoryGroup> StoryGroup { get; set; }
        public DbSet<AADates> AADates { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // CharacterRelationship configuration
            modelBuilder.Entity<CharacterRelationship>()
                .HasKey(cr => cr.RelationshipId);

            modelBuilder.Entity<CharacterRelationship>()
                .HasOne(cr => cr.CharacterA)
                .WithMany(c => c.CharacterRelationshipsA)
                .HasForeignKey(cr => cr.CharacterAId)
                .OnDelete(DeleteBehavior.Restrict); // Restrict delete to avoid circular cascade issues

            modelBuilder.Entity<CharacterRelationship>()
                .HasOne(cr => cr.CharacterB)
                .WithMany(c => c.CharacterRelationshipsB)
                .HasForeignKey(cr => cr.CharacterBId)
                .OnDelete(DeleteBehavior.Restrict); // Restrict delete to avoid circular cascade issues

            // StoryPartCharacter many-to-many relationship
            modelBuilder.Entity<StoryPartCharacter>()
                .HasKey(spc => new { spc.StoryPartId, spc.CharacterId });

            modelBuilder.Entity<StoryPartCharacter>()
                .HasOne(spc => spc.StoryPart)
                .WithMany(sp => sp.StoryPartCharacters)
                .HasForeignKey(spc => spc.StoryPartId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<StoryPartCharacter>()
                .HasOne(spc => spc.Character)
                .WithMany(c => c.StoryPartCharacters)
                .HasForeignKey(spc => spc.CharacterId)
                .OnDelete(DeleteBehavior.Cascade);

            // StoryPart configuration
            modelBuilder.Entity<StoryPart>()
                .HasKey(sp => sp.StoryPartId);

            modelBuilder.Entity<StoryPart>()
                .HasOne(sp => sp.Story)
                .WithMany(s => s.StoryParts)
                .HasForeignKey(sp => sp.StoryId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure foreign key relationship manually if needed
            modelBuilder.Entity<StoryPart>()
                .HasOne(sp => sp.AADate)
                .WithMany()  // AADates doesn't need a collection property
                .HasForeignKey(sp => sp.AADateId)
                .OnDelete(DeleteBehavior.SetNull);  // or whatever delete behavior you prefer

            // Story configuration
            modelBuilder.Entity<Story>()
                .HasKey(s => s.StoryId);

            modelBuilder.Entity<Story>()
                .HasOne(s => s.StoryGroup)
                .WithMany(sg => sg.Stories)
                .HasForeignKey(s => s.StoryGroupId)
                .OnDelete(DeleteBehavior.Cascade);

            // UserRole many-to-many relationship between User and Role
            modelBuilder.Entity<UserRole>()
                .HasKey(ur => new { ur.UserId, ur.RoleId });

            modelBuilder.Entity<UserRole>()
                .HasOne(ur => ur.User)
                .WithMany(u => u.UserRoles)
                .HasForeignKey(ur => ur.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<UserRole>()
                .HasOne(ur => ur.Role)
                .WithMany(r => r.UserRoles)
                .HasForeignKey(ur => ur.RoleId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
