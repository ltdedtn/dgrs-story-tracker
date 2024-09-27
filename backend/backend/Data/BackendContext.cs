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

        public DbSet<User> Users { get; set; }
        public DbSet<Story> Stories { get; set; }
        public DbSet<Character> Characters { get; set; }
        public DbSet<StoryPart> StoryParts { get; set; }
        public DbSet<StoryPartCharacter> StoryPartCharacters { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }

        public DbSet<StoryGroup> StoryGroup { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // StoryPartCharacter configurations
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

            // StoryPart configurations
            modelBuilder.Entity<StoryPart>()
                .HasKey(sp => sp.StoryPartId);

            modelBuilder.Entity<StoryPart>()
                .HasOne(sp => sp.Story)
                .WithMany(s => s.StoryParts)
                .HasForeignKey(sp => sp.StoryId)
                .OnDelete(DeleteBehavior.Cascade); // Cascade delete on Story -> StoryPart

            // Story configurations
            modelBuilder.Entity<Story>()
                .HasKey(s => s.StoryId);

            modelBuilder.Entity<Story>()
                .HasOne(s => s.StoryGroup)
                .WithMany(sg => sg.Stories)
                .HasForeignKey(s => s.StoryGroupId)
                .OnDelete(DeleteBehavior.Cascade); // Cascade delete on StoryGroup -> Story

            // Configure many-to-many relationship between User and Role
            modelBuilder.Entity<UserRole>()
                .HasKey(ur => new { ur.UserId, ur.RoleId });

            modelBuilder.Entity<UserRole>()
                .HasOne(ur => ur.User)
                .WithMany(u => u.UserRoles)
                .HasForeignKey(ur => ur.UserId);

            modelBuilder.Entity<UserRole>()
                .HasOne(ur => ur.Role)
                .WithMany(r => r.UserRoles)
                .HasForeignKey(ur => ur.RoleId);
        }

    }
}
