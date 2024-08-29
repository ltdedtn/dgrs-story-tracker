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

            // Configure the primary key for StoryPart
            modelBuilder.Entity<StoryPart>()
                .HasKey(sp => sp.PartId);

            // Configure the one-to-many relationship between Story and StoryPart
            modelBuilder.Entity<StoryPart>()
                .HasOne(sp => sp.Story)
                .WithMany(s => s.StoryParts)
                .HasForeignKey(sp => sp.StoryId);

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

            // Configure one-to-many relationship between StoryGroup and Story
            modelBuilder.Entity<StoryGroup>()
                .HasMany(sg => sg.Stories)
                .WithOne(s => s.StoryGroup)
                .HasForeignKey(s => s.StoryGroupId);
        }
    }
}
