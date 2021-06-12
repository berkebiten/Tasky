-- USER TABLE CREATION
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[User](
	[Id] [uniqueidentifier] NOT NULL,
	[FirstName] [nvarchar](50) NOT NULL,
	[LastName] [nvarchar](50) NOT NULL,
	[Email] [nvarchar](50) NOT NULL,
	[Password] [nvarchar](max) NULL,
	[ActivationStatus] [bit] NOT NULL,
	[Status] [bit] NOT NULL,
	[RegistrationDate] [date] NOT NULL,
	[FirebaseToken] [nvarchar](max) NULL,
	[ProfileImage] [nvarchar](max) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[User] ADD PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO

-- PROJECT TABLE CREATION

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Project](
	[Id] [uniqueidentifier] NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
	[Description] [nvarchar](max) NOT NULL,
	[ProjectManagerId] [uniqueidentifier] NOT NULL,
	[Status] [bit] NOT NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[Project] ADD PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Project]  WITH CHECK ADD FOREIGN KEY([ProjectManagerId])
REFERENCES [dbo].[User] ([Id])
GO


-- PROJECT PARTICIPANT TABLE CREATION
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ProjectParticipant](
	[Id] [uniqueidentifier] NOT NULL,
	[UserId] [uniqueidentifier] NOT NULL,
	[ProjectId] [uniqueidentifier] NOT NULL,
	[Role] [tinyint] NOT NULL
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[ProjectParticipant] ADD PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[ProjectParticipant]  WITH CHECK ADD FOREIGN KEY([ProjectId])
REFERENCES [dbo].[Project] ([Id])
GO
ALTER TABLE [dbo].[ProjectParticipant]  WITH CHECK ADD FOREIGN KEY([UserId])
REFERENCES [dbo].[User] ([Id])
GO

--TASK TABLE CREATION
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Task](
	[Id] [uniqueidentifier] NOT NULL,
	[ProjectId] [uniqueidentifier] NOT NULL,
	[Title] [nvarchar](50) NOT NULL,
	[Description] [nvarchar](max) NOT NULL,
	[AssigneeId] [uniqueidentifier] NULL,
	[ReporterId] [uniqueidentifier] NULL,
	[Status] [smallint] NOT NULL,
	[Priority] [smallint] NULL,
	[DueDate] [date] NULL,
	[CreatedDate] [date] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[Task] ADD PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Task]  WITH CHECK ADD FOREIGN KEY([AssigneeId])
REFERENCES [dbo].[User] ([Id])
GO
ALTER TABLE [dbo].[Task]  WITH CHECK ADD FOREIGN KEY([ProjectId])
REFERENCES [dbo].[Project] ([Id])
GO
ALTER TABLE [dbo].[Task]  WITH CHECK ADD FOREIGN KEY([ReporterId])
REFERENCES [dbo].[User] ([Id])
GO

--MAILTEMPLATE TABLE CREATION

SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[MailTemplate](
	[Code] [nvarchar](50) NOT NULL,
	[Subject] [nvarchar](max) NOT NULL,
	[Body] [nvarchar](max) NOT NULL,
	[To] [nvarchar](max) NULL,
	[Cc] [nvarchar](max) NULL,
	[Parameters] [nvarchar](max) NULL,
	[ValidityDuration] [int] NULL,
 CONSTRAINT [PK_MailTemplate] PRIMARY KEY CLUSTERED 
(
	[Code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO


--VW_TASK CREATION
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[VW_Task]
AS SELECT c.Id, c.ProjectId, c.Title, c.Description, D.[Status] as ProjectStatus, d.Name as Project_Title, c.RootId, c.Status, c.DueDate, c.AssigneeId, c.ReporterId, c.Priority, c.CreatedDate, a.FirstName as AssigneeFirstName, a.LastName as AssigneeLastName, b.FirstName as ReporterFirstName, b.LastName as ReporterLastName
FROM [dbo].[User] a,[dbo].[User] b, [dbo].[Task] c, [dbo].[Project] d
WHERE a.Id=c.AssigneeId AND b.Id=c.ReporterId AND d.Id=c.ProjectId;
GO

--VW_PROJECT CREATION
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[VW_Project]
AS SELECT b.Id, b.Name, b.Description, b.Status, b.ProjectManagerId, a.FirstName as ProjectManagerFirstName, a.LastName as ProjectManagerLastName
FROM [dbo].[User] a, Project b
WHERE a.Id=b.ProjectManagerId;
GO

--VW_PROJECTPARTICIPANT CREATION
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[VW_ProjectParticipant]
AS
SELECT        b.UserId, b.Id, b.ProjectId, a.FirstName, a.LastName, a.ProfileImage, b.Status, b.Role, c.Status AS ProjectStatus, c.Name as ProjectName
FROM            dbo.[User] AS a INNER JOIN
                         dbo.ProjectParticipant AS b ON a.Id = b.UserId INNER JOIN
                         dbo.Project AS c ON c.Id = b.ProjectId

GO

--WORKLOG CREATION
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[WorkLog](
	[Id] [uniqueidentifier] NOT NULL,
	[TaskId] [uniqueidentifier] NOT NULL,
	[UserId] [uniqueidentifier] NOT NULL,
	[Duration] [nvarchar](10) NOT NULL,
	[CreatedDate] [date] NOT NULL,
	[Description] [nvarchar](max) NOT NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[WorkLog] ADD PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[WorkLog]  WITH CHECK ADD FOREIGN KEY([TaskId])
REFERENCES [dbo].[Task] ([Id])
GO
ALTER TABLE [dbo].[WorkLog]  WITH CHECK ADD FOREIGN KEY([UserId])
REFERENCES [dbo].[User] ([Id])
GO

--VW_WORKLOG CREATION
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[VW_WorkLog]
AS SELECT w.Id, p.Id as ProjectId, w.TaskId, p.Name as ProjectName, t.Title as TaskTitle, u.FirstName, u.LastName, w.Duration, w.CreatedDate, w.[Description], w.UserId, u.ProfileImage
FROM [dbo].[User] u,[dbo].[WorkLog] w, [dbo].[Task] t, [dbo].[Project] p
WHERE u.Id=w.UserId AND t.Id=w.TaskId AND p.Id=t.ProjectId;
GO


--ALTER TASK TABLE
ALTER TABLE  [dbo].[Task]
    ADD RootId UNIQUEIDENTIFIER NULL,
    FOREIGN KEY(rootId) REFERENCES [dbo].[Task] (Id);

--TASK OPERATION TABLE CREATION
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TaskOperation](
	[Id] [uniqueidentifier] NOT NULL,
	[TaskId] [uniqueidentifier] NOT NULL,
	[UserId] [uniqueidentifier] NOT NULL,
	[OldStatus] [smallint] NOT NULL,
	[NewStatus] [smallint] NOT NULL,
	[Date] [datetime] NULL
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[TaskOperation] ADD PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[TaskOperation]  WITH CHECK ADD FOREIGN KEY([TaskId])
REFERENCES [dbo].[Task] ([Id])
GO
ALTER TABLE [dbo].[TaskOperation]  WITH CHECK ADD FOREIGN KEY([UserId])
REFERENCES [dbo].[User] ([Id])
GO

--VW_TASKOPERATION CREATION
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[VW_TaskOperation]
AS SELECT o.Id, o.TaskId, o.UserId, o.OldStatus, o.NewStatus, o.Date, u.FirstName as UserFirstName, u.LastName as UserLastName, u.ProfileImage as UserProfileImage
FROM [dbo].[User] u, [dbo].[TaskOperation] o
WHERE u.Id = o.UserId;
GO

--FILE CREATION
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[File](
	[Id] [uniqueidentifier] NOT NULL,
	[DataId] [uniqueidentifier] NOT NULL,
	[Name] [nvarchar](max) NOT NULL,
	[TableName] [nvarchar](max) NOT NULL,
	[CreatedDate] [datetime] NOT NULL,
	[CreatedBy] [uniqueidentifier] NOT NULL,
	[Base64] [varchar](max) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

--VW_FILE CREATION
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[VW_File]
AS SELECT f.Id, f.Name, f.Base64, f.TableName, f.DataId, f.CreatedBy, f.CreatedDate, u.FirstName as UserFirstName, u.LastName as UserLastName
FROM [dbo].[User] u,[dbo].[File] f
WHERE f.CreatedBy=u.Id;
GO

--VW_RecentProjects
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[VW_RecentProjects]
AS
SELECT        TOP (100) PERCENT u.Id AS UserId, p.Id AS ProjectId, p.Name AS ProjectName
FROM            dbo.[User] AS u LEFT OUTER JOIN
                         dbo.Task AS t1 ON u.Id = t1.AssigneeId LEFT OUTER JOIN
                         dbo.TaskOperation AS t2 ON t1.Id = t2.TaskId LEFT OUTER JOIN
                         dbo.WorkLog AS w ON t1.Id = w.TaskId INNER JOIN
                         dbo.Project AS p ON t1.ProjectId = p.Id
ORDER BY t2.Date DESC, w.CreatedDate DESC
GO

--ADD PREFERENCES
ALTER TABLE [dbo].[User]
ADD SendEmail BIT DEFAULT 1, SendNotification BIT DEFAULT 1

--Project Invitation Creation
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ProjectInvitation](
	[Id] [uniqueidentifier] NOT NULL,
	[ProjectId] [uniqueidentifier] NULL,
	[Email] [nvarchar](max) NULL,
	[Role] [tinyint] NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[ProjectInvitation] ADD PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[ProjectInvitation]  WITH CHECK ADD FOREIGN KEY([ProjectId])
REFERENCES [dbo].[Project] ([Id])
GO

--ALTER PROJECT PARTICIPANT
ALTER TABLE [dbo].[ProjectParticipant]
ADD Status BIT DEFAULT 1

--NOTIFICATION TABLE CREATION
CREATE TABLE Notification(
    Id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    UserId UNIQUEIDENTIFIER NOT NULL,
    Body NVARCHAR(MAX) NOT NULL,
    Title NVARCHAR(MAX) NOT NULL,
    WebUrl NVARCHAR(MAX) NOT NULL,
    MobileScreen NVARCHAR(MAX) NOT NULL,
    DataId UNIQUEIDENTIFIER NULL,
    IsRead BIT NOT NULL,
    FOREIGN KEY (UserId) REFERENCES [dbo].[User](id)
)

ALTER TABLE Notification ADD RegDate datetime