USE [master]
GO
/****** Object:  Database [Tasky]    Script Date: 15/06/2021 23:09:21 ******/
CREATE DATABASE [Tasky]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'Tasky', FILENAME = N'C:\Users\berbino\Tasky.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'Tasky_log', FILENAME = N'C:\Users\berbino\Tasky_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
GO
ALTER DATABASE [Tasky] SET COMPATIBILITY_LEVEL = 130
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [Tasky].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [Tasky] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [Tasky] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [Tasky] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [Tasky] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [Tasky] SET ARITHABORT OFF 
GO
ALTER DATABASE [Tasky] SET AUTO_CLOSE ON 
GO
ALTER DATABASE [Tasky] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [Tasky] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [Tasky] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [Tasky] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [Tasky] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [Tasky] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [Tasky] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [Tasky] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [Tasky] SET  ENABLE_BROKER 
GO
ALTER DATABASE [Tasky] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [Tasky] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [Tasky] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [Tasky] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [Tasky] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [Tasky] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [Tasky] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [Tasky] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [Tasky] SET  MULTI_USER 
GO
ALTER DATABASE [Tasky] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [Tasky] SET DB_CHAINING OFF 
GO
ALTER DATABASE [Tasky] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [Tasky] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [Tasky] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [Tasky] SET QUERY_STORE = OFF
GO
USE [Tasky]
GO
ALTER DATABASE SCOPED CONFIGURATION SET LEGACY_CARDINALITY_ESTIMATION = OFF;
GO
ALTER DATABASE SCOPED CONFIGURATION SET MAXDOP = 0;
GO
ALTER DATABASE SCOPED CONFIGURATION SET PARAMETER_SNIFFING = ON;
GO
ALTER DATABASE SCOPED CONFIGURATION SET QUERY_OPTIMIZER_HOTFIXES = OFF;
GO
USE [Tasky]
GO
/****** Object:  Table [dbo].[User]    Script Date: 15/06/2021 23:09:21 ******/
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
	[RegistrationDate] [date] NOT NULL,
	[FirebaseToken] [nvarchar](max) NULL,
	[ProfileImage] [nvarchar](max) NULL,
	[SendEmail] [bit] NULL,
	[SendNotification] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Project]    Script Date: 15/06/2021 23:09:21 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Project](
	[Id] [uniqueidentifier] NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
	[Description] [nvarchar](max) NOT NULL,
	[ProjectManagerId] [uniqueidentifier] NOT NULL,
	[Status] [bit] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Task]    Script Date: 15/06/2021 23:09:21 ******/
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
	[DueDate] [date] NULL,
	[CreatedDate] [date] NULL,
	[RootId] [uniqueidentifier] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  View [dbo].[VW_Task]    Script Date: 15/06/2021 23:09:21 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[VW_Task]
AS SELECT c.Id, c.ProjectId, c.Title, c.Description, D.[Status] as ProjectStatus, d.Name as Project_Title, c.RootId, c.Status, c.DueDate, c.AssigneeId, c.ReporterId, c.CreatedDate, a.FirstName as AssigneeFirstName, a.LastName as AssigneeLastName, b.FirstName as ReporterFirstName, b.LastName as ReporterLastName
FROM [dbo].[User] a,[dbo].[User] b, [dbo].[Task] c, [dbo].[Project] d
WHERE a.Id=c.AssigneeId AND b.Id=c.ReporterId AND d.Id=c.ProjectId;
GO
/****** Object:  View [dbo].[VW_Project]    Script Date: 15/06/2021 23:09:21 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[VW_Project]
AS SELECT b.Id, b.Name, b.Description, b.Status, b.ProjectManagerId, a.FirstName as ProjectManagerFirstName, a.LastName as ProjectManagerLastName
FROM [dbo].[User] a, Project b
WHERE a.Id=b.ProjectManagerId;
GO
/****** Object:  Table [dbo].[WorkLog]    Script Date: 15/06/2021 23:09:21 ******/
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
	[Description] [nvarchar](max) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  View [dbo].[VW_WorkLog]    Script Date: 15/06/2021 23:09:21 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[VW_WorkLog]
AS SELECT w.Id, p.Id as ProjectId, w.TaskId, p.Name as ProjectName, t.Title as TaskTitle, u.FirstName, u.LastName, w.Duration, w.CreatedDate, w.[Description], w.UserId, u.ProfileImage
FROM [dbo].[User] u,[dbo].[WorkLog] w, [dbo].[Task] t, [dbo].[Project] p
WHERE u.Id=w.UserId AND t.Id=w.TaskId AND p.Id=t.ProjectId;
GO
/****** Object:  Table [dbo].[TaskOperation]    Script Date: 15/06/2021 23:09:21 ******/
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
	[Date] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  View [dbo].[VW_TaskOperation]    Script Date: 15/06/2021 23:09:21 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[VW_TaskOperation]
AS SELECT o.Id, o.TaskId, o.UserId, o.OldStatus, o.NewStatus, o.Date, u.FirstName as UserFirstName, u.LastName as UserLastName, u.ProfileImage as UserProfileImage
FROM [dbo].[User] u, [dbo].[TaskOperation] o
WHERE u.Id = o.UserId;
GO
/****** Object:  Table [dbo].[File]    Script Date: 15/06/2021 23:09:21 ******/
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
/****** Object:  View [dbo].[VW_File]    Script Date: 15/06/2021 23:09:21 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[VW_File]
AS SELECT f.Id, f.Name, f.Base64, f.TableName, f.DataId, f.CreatedBy, f.CreatedDate, u.FirstName as UserFirstName, u.LastName as UserLastName
FROM [dbo].[User] u,[dbo].[File] f
WHERE f.CreatedBy=u.Id;
GO
/****** Object:  View [dbo].[VW_RecentProjects]    Script Date: 15/06/2021 23:09:21 ******/
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
/****** Object:  Table [dbo].[ProjectParticipant]    Script Date: 15/06/2021 23:09:21 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ProjectParticipant](
	[Id] [uniqueidentifier] NOT NULL,
	[UserId] [uniqueidentifier] NOT NULL,
	[ProjectId] [uniqueidentifier] NOT NULL,
	[Role] [tinyint] NOT NULL,
	[Status] [bit] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  View [dbo].[VW_ProjectParticipant]    Script Date: 15/06/2021 23:09:21 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE VIEW [dbo].[VW_ProjectParticipant]
AS
SELECT        b.UserId, b.Id, b.ProjectId, a.FirstName, a.LastName,  a.Email, a.ProfileImage, b.Status, b.Role, c.Status AS ProjectStatus, c.Name as ProjectName
FROM            dbo.[User] AS a INNER JOIN
                         dbo.ProjectParticipant AS b ON a.Id = b.UserId INNER JOIN
                         dbo.Project AS c ON c.Id = b.ProjectId
GO
/****** Object:  Table [dbo].[MailTemplate]    Script Date: 15/06/2021 23:09:21 ******/
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
/****** Object:  Table [dbo].[Notification]    Script Date: 15/06/2021 23:09:21 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Notification](
	[Id] [uniqueidentifier] NOT NULL,
	[UserId] [uniqueidentifier] NOT NULL,
	[Body] [nvarchar](max) NOT NULL,
	[Title] [nvarchar](max) NOT NULL,
	[WebUrl] [nvarchar](max) NOT NULL,
	[MobileScreen] [nvarchar](max) NULL,
	[DataId] [uniqueidentifier] NULL,
	[IsRead] [bit] NOT NULL,
	[RegDate] [datetime] NULL,
 CONSTRAINT [PK__Notifica__3214EC07F338CEB7] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ProjectInvitation]    Script Date: 15/06/2021 23:09:21 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ProjectInvitation](
	[Id] [uniqueidentifier] NOT NULL,
	[ProjectId] [uniqueidentifier] NULL,
	[Email] [nvarchar](max) NULL,
	[Role] [tinyint] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
INSERT [dbo].[MailTemplate] ([Code], [Subject], [Body], [To], [Cc], [Parameters], [ValidityDuration]) VALUES (N'invitation_respond', N'Response to Invitation', N'<p>Hello, [FIRSTNAME].</p>  <p>[RESPONSERFIRSTNAME], has [AORD] your invitation to [PROJECTNAME]</p> ', N'', N'', N'[FIRSTNAME],[RESPONSERFIRSTNAME],[AORD],[PROJECTNAME]', 30)
INSERT [dbo].[MailTemplate] ([Code], [Subject], [Body], [To], [Cc], [Parameters], [ValidityDuration]) VALUES (N'invite_to_project', N'Project Invitation', N'<p>Hello, [FIRSTNAME]</p>  <p>[PROJECTMANAGER] invited you to a project. You can accept the invitation by clicking the link below. <br/><br/> <a href="[LINK]">ACCEPT INVITATION</a></p> ', NULL, NULL, N'[FIRSTNAME], [PROJECTMANAGER], [LINK]', 30)
INSERT [dbo].[MailTemplate] ([Code], [Subject], [Body], [To], [Cc], [Parameters], [ValidityDuration]) VALUES (N'participant_left', N'Participant Left', N'<p>Hello, [FIRSTNAME].</p>  <p>[PARTICIPANTNAME] left [PROJECTNAME].</p>  ', N'', N'', N'[FIRSTNAME],[PARTICIPANTNAME],[PROJECTNAME]', 30)
INSERT [dbo].[MailTemplate] ([Code], [Subject], [Body], [To], [Cc], [Parameters], [ValidityDuration]) VALUES (N'project_closed', N'Project Closed', N'<p>Hello, [FIRSTNAME]</p>  <p>[PROJECTNAME] is closed.</p> ', NULL, NULL, N'[FIRSTNAME], [PROJECTNAME]', 30)
INSERT [dbo].[MailTemplate] ([Code], [Subject], [Body], [To], [Cc], [Parameters], [ValidityDuration]) VALUES (N'project_deleted', N'Project Deleted', N'<p>Hello, [FIRSTNAME]</p>  <p>[PROJECTNAME] is deleted.</p> ', NULL, NULL, N'[FIRSTNAME], [PROJECTNAME]', 30)
INSERT [dbo].[MailTemplate] ([Code], [Subject], [Body], [To], [Cc], [Parameters], [ValidityDuration]) VALUES (N'register_activation', N'Email Activation', N'<p>Welcome to Tasky, [FIRSTNAME].</p>  <p>You should click the activation link below in order to activate your account.</p>  <a href=''[LINK]''>Click here.</a>', N'', N'', N'[FIRSTNAME],[LINK]', 7)
INSERT [dbo].[MailTemplate] ([Code], [Subject], [Body], [To], [Cc], [Parameters], [ValidityDuration]) VALUES (N'removed_from_project', N'Removed from Project', N'<p>Hello, [FIRSTNAME].</p>  <p>You are removed from [PROJECTNAME] by [PROJECTOWNERNAME].</p>', N'', N'', N'[FIRSTNAME],[PROJECTNAME],[PROJECTOWNERNAME]', 30)
INSERT [dbo].[MailTemplate] ([Code], [Subject], [Body], [To], [Cc], [Parameters], [ValidityDuration]) VALUES (N'reset_password', N'Reset Password', N'<p>Hello, [FIRSTNAME].</p>  <p>You can reset your password by clicking the link below. <br/> <a href="[LINK]">RESET PASSWORD</a></p> ', NULL, NULL, N'[FIRSTNAME], [LINK]', 7)
INSERT [dbo].[MailTemplate] ([Code], [Subject], [Body], [To], [Cc], [Parameters], [ValidityDuration]) VALUES (N'task_assigned', N'Task Assigned', N'<p>Hello, [FIRSTNAME].</p>  <p><a href=''[LINK]''>task</a> assigned to you under [PROJECTNAME].</p>', N'', N'', N'[FIRSTNAME],[PROJECTNAME]', 30)
INSERT [dbo].[MailTemplate] ([Code], [Subject], [Body], [To], [Cc], [Parameters], [ValidityDuration]) VALUES (N'task_created', N'Task Created', N'<p>Hello, [FIRSTNAME].</p>  <p>A new <a href=''[LINK]''>task</a> has been created under [PROJECTNAME].</p>  ', N'', N'', N'[FIRSTNAME],[LINK],[PROJECTNAME]', 30)
INSERT [dbo].[MailTemplate] ([Code], [Subject], [Body], [To], [Cc], [Parameters], [ValidityDuration]) VALUES (N'task_deleted', N'Task Deleted', N'<p>Hello, [FIRSTNAME]</p>  <p>Task [TASKNAME] under [PROJECTNAME] is deleted.', NULL, NULL, N'[FIRSTNAME], [TASKNAME], [PROJECTNAME]', 30)
INSERT [dbo].[MailTemplate] ([Code], [Subject], [Body], [To], [Cc], [Parameters], [ValidityDuration]) VALUES (N'task_updated', N'Task Updated', N'<p>Hello, [FIRSTNAME].</p>  <p> <a href=''[LINK]''>[TASKNAME]</a> task that is related to you has been updated.</p> ', N'', N'', N'[FIRSTNAME],[LINK],[TASKNAME]', 30)
INSERT [dbo].[MailTemplate] ([Code], [Subject], [Body], [To], [Cc], [Parameters], [ValidityDuration]) VALUES (N'worklog_entry', N'Work Logged', N'<p>Hello, [FIRSTNAME].</p>  <p>A new work has been logged to <a href=''[LINK]''>[TASKNAME]</a> task that is being reported to you.</p>  ', N'', N'', N'[FIRSTNAME],[LINK],[TASKNAME]', 30)
GO
INSERT [dbo].[Notification] ([Id], [UserId], [Body], [Title], [WebUrl], [MobileScreen], [DataId], [IsRead], [RegDate]) VALUES (N'7e23cc0a-faf2-4c95-ce4b-08d93030f333', N'21076128-23c4-4bbf-c70d-08d9302d9998', N'Project: Tasky is deleted.', N'Project Deleted', N'projects', N'PROJECT', N'21076128-23c4-4bbf-c70d-08d9302d9998', 1, CAST(N'2021-06-15T22:08:24.630' AS DateTime))
INSERT [dbo].[Notification] ([Id], [UserId], [Body], [Title], [WebUrl], [MobileScreen], [DataId], [IsRead], [RegDate]) VALUES (N'772a6d91-00f0-4e5d-ce4c-08d93030f333', N'21076128-23c4-4bbf-c70d-08d9302d9998', N'Project: test is deleted.', N'Project Deleted', N'projects', N'PROJECT', N'21076128-23c4-4bbf-c70d-08d9302d9998', 1, CAST(N'2021-06-15T22:09:38.723' AS DateTime))
INSERT [dbo].[Notification] ([Id], [UserId], [Body], [Title], [WebUrl], [MobileScreen], [DataId], [IsRead], [RegDate]) VALUES (N'c0fcab0c-77a2-423e-5ebd-08d930365bdd', N'21076128-23c4-4bbf-c70d-08d9302d9998', N'Project: asdwqe222 is deleted.', N'Project Deleted', N'projects', N'PROJECT', N'21076128-23c4-4bbf-c70d-08d9302d9998', 1, CAST(N'2021-06-15T22:47:07.710' AS DateTime))
GO
INSERT [dbo].[Project] ([Id], [Name], [Description], [ProjectManagerId], [Status]) VALUES (N'4b9d9039-5b6e-4a96-c23b-08d930367474', N'Sample Project', N'Sample Project Description. Lorem Ipsum Dolor Sit Amet.', N'21076128-23c4-4bbf-c70d-08d9302d9998', 1)
INSERT [dbo].[Project] ([Id], [Name], [Description], [ProjectManagerId], [Status]) VALUES (N'f06ad16f-1a16-48d7-c23c-08d930367474', N'Sample Closed Project', N'This project is closed.', N'21076128-23c4-4bbf-c70d-08d9302d9998', 0)
GO
INSERT [dbo].[ProjectInvitation] ([Id], [ProjectId], [Email], [Role]) VALUES (N'83594f66-9f04-4251-6338-08d9303674fc', N'f06ad16f-1a16-48d7-c23c-08d930367474', N'oguzkaanxox@gmail.com', 0)
GO
INSERT [dbo].[ProjectParticipant] ([Id], [UserId], [ProjectId], [Role], [Status]) VALUES (N'ec5f265a-9969-4d18-eeab-08d930367474', N'21076128-23c4-4bbf-c70d-08d9302d9998', N'4b9d9039-5b6e-4a96-c23b-08d930367474', 1, 1)
INSERT [dbo].[ProjectParticipant] ([Id], [UserId], [ProjectId], [Role], [Status]) VALUES (N'b42067bb-bbbc-4008-eeac-08d930367474', N'21076128-23c4-4bbf-c70d-08d9302d9998', N'f06ad16f-1a16-48d7-c23c-08d930367474', 1, 1)
GO
INSERT [dbo].[Task] ([Id], [ProjectId], [Title], [Description], [AssigneeId], [ReporterId], [Status], [DueDate], [CreatedDate], [RootId]) VALUES (N'519cbe41-7604-483a-25da-08d9303691ed', N'4b9d9039-5b6e-4a96-c23b-08d930367474', N'Sample Task', N'Sample Task Description. lorem ipsum.', N'21076128-23c4-4bbf-c70d-08d9302d9998', N'21076128-23c4-4bbf-c70d-08d9302d9998', 1, CAST(N'2021-06-16' AS Date), CAST(N'2021-06-15' AS Date), NULL)
INSERT [dbo].[Task] ([Id], [ProjectId], [Title], [Description], [AssigneeId], [ReporterId], [Status], [DueDate], [CreatedDate], [RootId]) VALUES (N'e579f258-3d30-4173-25db-08d9303691ed', N'4b9d9039-5b6e-4a96-c23b-08d930367474', N'Sample Sub-Task', N'Sample Sub-Task Description', N'21076128-23c4-4bbf-c70d-08d9302d9998', N'21076128-23c4-4bbf-c70d-08d9302d9998', 0, CAST(N'2021-06-16' AS Date), CAST(N'2021-06-15' AS Date), N'519cbe41-7604-483a-25da-08d9303691ed')
INSERT [dbo].[Task] ([Id], [ProjectId], [Title], [Description], [AssigneeId], [ReporterId], [Status], [DueDate], [CreatedDate], [RootId]) VALUES (N'48075f2c-e8d9-4958-25dc-08d9303691ed', N'4b9d9039-5b6e-4a96-c23b-08d930367474', N'Test Task', N'This is a test task.', N'21076128-23c4-4bbf-c70d-08d9302d9998', N'21076128-23c4-4bbf-c70d-08d9302d9998', 2, CAST(N'2021-06-17' AS Date), CAST(N'2021-06-15' AS Date), NULL)
GO
INSERT [dbo].[TaskOperation] ([Id], [TaskId], [UserId], [OldStatus], [NewStatus], [Date]) VALUES (N'25e7788c-023b-4f88-16a3-08d93036aa24', N'519cbe41-7604-483a-25da-08d9303691ed', N'21076128-23c4-4bbf-c70d-08d9302d9998', 0, 1, CAST(N'2021-06-15T22:49:19.050' AS DateTime))
INSERT [dbo].[TaskOperation] ([Id], [TaskId], [UserId], [OldStatus], [NewStatus], [Date]) VALUES (N'2161206a-15a7-44fb-16a4-08d93036aa24', N'48075f2c-e8d9-4958-25dc-08d9303691ed', N'21076128-23c4-4bbf-c70d-08d9302d9998', 0, 2, CAST(N'2021-06-15T22:50:46.927' AS DateTime))
GO
INSERT [dbo].[User] ([Id], [FirstName], [LastName], [Email], [Password], [ActivationStatus], [RegistrationDate], [FirebaseToken], [ProfileImage], [SendEmail], [SendNotification]) VALUES (N'21076128-23c4-4bbf-c70d-08d9302d9998', N'Berke', N'Biten', N'berkesgs4@gmail.com', N'$2a$11$QMkGP5Td5JlQXANjsHYZQeMBeQ.JsP6UqyvrTz0BrVXOwh4ldtZMe', 1, CAST(N'2021-06-15' AS Date), NULL, N'data:image/jpeg;base64,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', 1, 1)
INSERT [dbo].[User] ([Id], [FirstName], [LastName], [Email], [Password], [ActivationStatus], [RegistrationDate], [FirebaseToken], [ProfileImage], [SendEmail], [SendNotification]) VALUES (N'5e2d86c7-7be4-4136-8b74-08d93036fd05', N'Oguz', N'Yazan', N'oguzkaanxox@gmail.com', N'$2a$11$82/.bVBU41c7MUfpozkta.Y0Rch5dKJkfS.QMFXobO0BZsI3ojoay', 1, CAST(N'2021-06-15' AS Date), NULL, NULL, 1, 1)
GO
INSERT [dbo].[WorkLog] ([Id], [TaskId], [UserId], [Duration], [CreatedDate], [Description]) VALUES (N'54f2e0f3-5dd7-49bb-94cf-08d930369943', N'519cbe41-7604-483a-25da-08d9303691ed', N'21076128-23c4-4bbf-c70d-08d9302d9998', N'2h', CAST(N'2021-06-15' AS Date), N'lorem ipsum dolor sit amet')
GO
ALTER TABLE [dbo].[Notification]  WITH CHECK ADD  CONSTRAINT [FK__Notificat__UserI__2EDAF651] FOREIGN KEY([UserId])
REFERENCES [dbo].[User] ([Id])
GO
ALTER TABLE [dbo].[Notification] CHECK CONSTRAINT [FK__Notificat__UserI__2EDAF651]
GO
ALTER TABLE [dbo].[Project]  WITH CHECK ADD FOREIGN KEY([ProjectManagerId])
REFERENCES [dbo].[User] ([Id])
GO
ALTER TABLE [dbo].[ProjectInvitation]  WITH CHECK ADD FOREIGN KEY([ProjectId])
REFERENCES [dbo].[Project] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[ProjectParticipant]  WITH CHECK ADD FOREIGN KEY([ProjectId])
REFERENCES [dbo].[Project] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[ProjectParticipant]  WITH CHECK ADD FOREIGN KEY([UserId])
REFERENCES [dbo].[User] ([Id])
GO
ALTER TABLE [dbo].[Task]  WITH CHECK ADD FOREIGN KEY([AssigneeId])
REFERENCES [dbo].[User] ([Id])
GO
ALTER TABLE [dbo].[Task]  WITH CHECK ADD FOREIGN KEY([ProjectId])
REFERENCES [dbo].[Project] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[Task]  WITH CHECK ADD FOREIGN KEY([ReporterId])
REFERENCES [dbo].[User] ([Id])
GO
ALTER TABLE [dbo].[Task]  WITH CHECK ADD FOREIGN KEY([RootId])
REFERENCES [dbo].[Task] ([Id])
GO
ALTER TABLE [dbo].[TaskOperation]  WITH CHECK ADD FOREIGN KEY([TaskId])
REFERENCES [dbo].[Task] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[TaskOperation]  WITH CHECK ADD FOREIGN KEY([UserId])
REFERENCES [dbo].[User] ([Id])
GO
ALTER TABLE [dbo].[WorkLog]  WITH CHECK ADD FOREIGN KEY([TaskId])
REFERENCES [dbo].[Task] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[WorkLog]  WITH CHECK ADD FOREIGN KEY([UserId])
REFERENCES [dbo].[User] ([Id])
GO
USE [master]
GO
ALTER DATABASE [Tasky] SET  READ_WRITE 
GO
