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

        protected override void OnModelCreating(ModelBuilder modelBuilder)

        {
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

        }
    }
}
