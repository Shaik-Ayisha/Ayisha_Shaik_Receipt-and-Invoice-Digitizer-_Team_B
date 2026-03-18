create database infosys;
use infosys;

create table students (id int, name varchar(10) ,branch varchar(10));
insert into students values (1,'ayisha','cse'), (2,'jhon','it'), (3, 'alice','ece');
insert into students values (4,'bob','csm');

create table courses (id int, course varchar(20));
insert into courses values (1,'computing'), (2,'technology'),(3,'circuits');

select students.id, students.name, students.branch, courses.course
from students
inner join courses
on students.id = courses.id;

select students.id, students.name, students.branch, courses.course
from students
left join courses
on students.id = courses.id;

select students.id, students.name, students.branch, courses.course
from students
right join courses
on students.id = courses.id;







