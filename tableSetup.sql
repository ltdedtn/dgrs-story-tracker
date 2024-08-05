CREATE TABLE Users (
    UserId INT PRIMARY KEY IDENTITY(1,1),
    Username NVARCHAR(50) NOT NULL,
    PasswordHash NVARCHAR(256) NOT NULL,
    Email NVARCHAR(100) NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE()
);

CREATE TABLE Stories (
    StoryId INT PRIMARY KEY IDENTITY(1,1),
    Title NVARCHAR(100) NOT NULL,
    Description NVARCHAR(MAX),
    CreatedAt DATETIME DEFAULT GETDATE(),
    UserId INT,
    ImageUrl NVARCHAR(MAX),
    FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

CREATE TABLE Characters (
    CharacterId INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(50) NOT NULL,
    Description NVARCHAR(MAX),
    StoryId INT,
    ImageUrl NVARCHAR(MAX),
    FOREIGN KEY (StoryId) REFERENCES Stories(StoryId)
);

CREATE TABLE StoryParts (
    PartId INT PRIMARY KEY IDENTITY(1,1),
    Content NVARCHAR(MAX) NOT NULL,
    StoryId INT,
    CreatedAt DATETIME DEFAULT GETDATE(),
    ImageUrl NVARCHAR(MAX),
    FOREIGN KEY (StoryId) REFERENCES Stories(StoryId)
);

CREATE TABLE StoryPartCharacters (
    StoryPartId INT,
    CharacterId INT,
    PRIMARY KEY (StoryPartId, CharacterId),
    FOREIGN KEY (StoryPartId) REFERENCES StoryParts(PartId),
    FOREIGN KEY (CharacterId) REFERENCES Characters(CharacterId)
);

-- Indexes
CREATE INDEX idx_StoryId ON Characters (StoryId);
CREATE INDEX idx_StoryId_CharacterId ON StoryPartCharacters (StoryPartId, CharacterId);
