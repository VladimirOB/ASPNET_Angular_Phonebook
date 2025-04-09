create database NG_Exam_PhoneBook
use NG_Exam_PhoneBook

create table contacts(con_id int primary key identity, owner_id int not null, name nvarchar(100) not null, group_id int not null, 
email nvarchar(100), address nvarchar(100))

create table numbers(num_id int primary key identity, con_id int, number nvarchar(16) not null,
	foreign key (con_id) references contacts(con_id) on delete cascade on update cascade)

create table groups(
	group_id int primary key identity,
	owner_id int not null,
	name nvarchar(100) not null
)
--connect contacts with groups
alter table contacts
add constraint FK_contacts_groups
foreign key (group_id) references groups(group_id)

create table users(user_id int primary key identity, login nvarchar(16) unique, password nvarchar(64))


--clear identity 
DBCC CHECKIDENT ('users', RESEED, 0)
GO

select * from contacts
where owner_id in(
select user_id from users 
where user_id = owner_id)

select * from numbers
where con_id in(
select con_id from contacts
where con_id = 3)