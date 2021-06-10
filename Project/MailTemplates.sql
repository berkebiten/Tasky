/****** Object:  Table [dbo].[MailTemplate]    Script Date: 10.06.2021 18:13:15 ******/
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
INSERT [dbo].[MailTemplate] ([Code], [Subject], [Body], [To], [Cc], [Parameters], [ValidityDuration]) VALUES (N'invitation_respond', N'Response to Invitation', N'<p>Hello, [FIRSTNAME].</p>  <p>[RESPONSERFIRSTNAME], has [AORD]ed your invitation to [PROJECTNAME]</p> ', N'', N'', N'[FIRSTNAME],[RESPONSERFIRSTNAME],[AORD],[PROJECTNAME]', 30)
INSERT [dbo].[MailTemplate] ([Code], [Subject], [Body], [To], [Cc], [Parameters], [ValidityDuration]) VALUES (N'participant_left', N'Participant Left', N'<p>Hello, [FIRSTNAME].</p>  <p>[PARTICIPANTNAME] left [PROJECTNAME].</p>  ', N'', N'', N'[FIRSTNAME],[PARTICIPANTNAME],[PROJECTNAME]', 30)
INSERT [dbo].[MailTemplate] ([Code], [Subject], [Body], [To], [Cc], [Parameters], [ValidityDuration]) VALUES (N'register_activation', N'Email Activation', N'<p>Welcome to Tasky, [FIRSTNAME].</p>  <p>You should click the link below in order to activate your e-mail.</p> <a href=''[LINK]''>CLICK HERE TO ACTIVATE</a> <p>This link is only valid for seven days.', N'', N'', N'[FIRSTNAME],[LINK]', 7)
INSERT [dbo].[MailTemplate] ([Code], [Subject], [Body], [To], [Cc], [Parameters], [ValidityDuration]) VALUES (N'removed_from_project', N'Removed from Project', N'<p>Hello, [FIRSTNAME].</p>  <p>You are removed from [PROJECTNAME] by [PROJECTOWNERNAME].</p>', N'', N'', N'[FIRSTNAME],[PROJECTNAME],[PROJECTOWNERNAME]', 30)
INSERT [dbo].[MailTemplate] ([Code], [Subject], [Body], [To], [Cc], [Parameters], [ValidityDuration]) VALUES (N'task_assigned', N'Task Assigned', N'<p>Hello, [FIRSTNAME].</p>  <p><a href=''[LINK]''>task</a> assigned to you under [PROJECTNAME].</p>', N'', N'', N'[FIRSTNAME],[PROJECTNAME]', 30)
INSERT [dbo].[MailTemplate] ([Code], [Subject], [Body], [To], [Cc], [Parameters], [ValidityDuration]) VALUES (N'task_created', N'Task Created', N'<p>Hello, [FIRSTNAME].</p>  <p>A new <a href=''[LINK]''>task</a> has been created under [PROJECTNAME].</p>  ', N'', N'', N'[FIRSTNAME],[LINK],[PROJECTNAME]', 30)
INSERT [dbo].[MailTemplate] ([Code], [Subject], [Body], [To], [Cc], [Parameters], [ValidityDuration]) VALUES (N'task_updated', N'Task Updated', N'<p>Hello, [FIRSTNAME].</p>  <p> <a href=''[LINK]''>[TASKNAME]</a> task that is related to you has been updated.</p> ', N'', N'', N'[FIRSTNAME],[LINK],[TASKNAME]', 30)
INSERT [dbo].[MailTemplate] ([Code], [Subject], [Body], [To], [Cc], [Parameters], [ValidityDuration]) VALUES (N'worklog_entry', N'Work Logged', N'<p>Hello, [FIRSTNAME].</p>  <p>A new work has been logged to <a href=''[LINK]''>[TASKNAME]</a> task that is being reported to you.</p>  ', N'', N'', N'[FIRSTNAME],[LINK],[TASKNAME]', 30)
GO
