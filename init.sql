IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'TESTA')
BEGIN
    PRINT 'Creating TESTA database...';
    CREATE DATABASE TESTA;
END
ELSE
BEGIN
    PRINT 'Database TESTA already exists.';
END


GO

-- Use the database
USE TESTA;
GO

-- (Then place the rest of your table creation scripts here)

PRINT 'Creating tables...';

-- Users Table
CREATE TABLE Users
(
    UserId INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(100) NOT NULL UNIQUE,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    PasswordHash NVARCHAR(255) NOT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE()
);

-- Roles Table
CREATE TABLE Roles
(
    RoleId INT IDENTITY(1,1) PRIMARY KEY,
    RoleName NVARCHAR(50) NOT NULL UNIQUE
);

-- UserRoles Table (Many-to-Many relationship between Users and Roles)
CREATE TABLE UserRoles
(
    UserRoleId INT IDENTITY(1,1) PRIMARY KEY,
    UserId INT NOT NULL,
    RoleId INT NOT NULL,
    FOREIGN KEY (UserId) REFERENCES Users(UserId),
    FOREIGN KEY (RoleId) REFERENCES Roles(RoleId)
);

-- Characters Table
CREATE TABLE Characters
(
    CharacterId INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Description TEXT NULL,
    ImageUrl NVARCHAR(255) NULL,
    RelationshipTag NVARCHAR(50) CHECK (RelationshipTag IN ('Friendly', 'Neutral', 'Enemy')),
    StoryId INT NULL
);

-- Stories Table
CREATE TABLE Stories
(
    StoryId INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(255) NOT NULL,
    Description TEXT NULL,
    Content TEXT NOT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    ImageUrl NVARCHAR(255) NULL,
    StoryGroupId INT NULL
);

-- StoryParts Table
CREATE TABLE StoryParts
(
    StoryPartId INT IDENTITY(1,1) PRIMARY KEY,
    StoryId INT NOT NULL,
    Title NVARCHAR(255) NOT NULL,
    Content TEXT NOT NULL,
    Description TEXT NULL,
    CreatedBy INT NULL,
    CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
    ImageUrl NVARCHAR(255) NULL,
    FOREIGN KEY (StoryId) REFERENCES Stories(StoryId)
);

-- StoryGroups Table
CREATE TABLE StoryGroup
(
    StoryGroupId INT IDENTITY(1,1) PRIMARY KEY,
    Title NVARCHAR(255) NOT NULL,
    Description TEXT NULL,
    ImageUrl NVARCHAR(255) NULL
);

-- StoryGroupStories Table (Many-to-Many relationship between StoryGroups and Stories)
CREATE TABLE StoryGroupStories
(
    StoryGroupStoryId INT IDENTITY(1,1) PRIMARY KEY,
    StoryGroupId INT NOT NULL,
    StoryId INT NOT NULL,
    FOREIGN KEY (StoryGroupId) REFERENCES StoryGroup(StoryGroupId),
    FOREIGN KEY (StoryId) REFERENCES Stories(StoryId)
);

-- StoryPartCharacters Table (Many-to-Many relationship between StoryParts and Characters)
CREATE TABLE StoryPartCharacters
(
    StoryPartCharacterId INT IDENTITY(1,1) PRIMARY KEY,
    StoryPartId INT NOT NULL,
    CharacterId INT NOT NULL,
    FOREIGN KEY (StoryPartId) REFERENCES StoryParts(StoryPartId),
    FOREIGN KEY (CharacterId) REFERENCES Characters(CharacterId)
);

-- CharacterRelationships Table
CREATE TABLE CharacterRelationships
(
    RelationshipId INT IDENTITY(1,1) PRIMARY KEY,
    CharacterAId INT NOT NULL,
    CharacterBId INT NOT NULL,
    RelationshipTag NVARCHAR(50) CHECK (RelationshipTag IN ('Friendly', 'Neutral', 'Enemy', 'Unknown')) NOT NULL DEFAULT 'Unknown',
    FOREIGN KEY (CharacterAId) REFERENCES Characters(CharacterId),
    FOREIGN KEY (CharacterBId) REFERENCES Characters(CharacterId),
    CHECK (CharacterAId <> CharacterBId)
);

-- Insert default roles into Roles table
INSERT INTO Roles
    (RoleName)
VALUES
    ('Guest'),
    ('Standard User'),
    ('Editor'),
    ('Admin');

