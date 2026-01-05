# SQL Movie Database Queries
---

#### 1. Write a SQL query to find the name and year of the movies. Return movie title, movie release year.

- **Query:**

    ```sql
    select mov_title, mov_year   from movie;
    ```

- **Output:**

    ```


    | mov_title                | mov_year |
    ---------------------------------------
    | Vertigo                  |     1958 |
    | The Innocents            |     1961 |
    | Lawrence of Arabia       |     1962 |
    | The Deer Hunter          |     1978 |
    | Amadeus                  |     1984 |
    | Blade Runner             |     1982 |
    | Eyes Wide Shut           |     1999 |
    | The Usual Suspects       |     1995 |
    | Chinatown                |     1974 |
    | Boogie Nights            |     1 997 |
    | Annie Hall               |     1977 |
    | Princess Mononoke        |     1997 |
    | The Shawshank Redemption |     1994 |
    | American Beauty          |     1999 |
    | Titanic                  |     1997 |
    | Good Will Hunting        |     1997 |
    | Deliverance              |     1972 |
    | Trainspotting            |     1996 |
    | The Prestige             |     2006 |
    | Donnie Darko             |     2001 |
    | Slumdog Millionaire      |     2008 |
    | Aliens                   |     1986 |
    | Beyond the Sea           |     2004 |
    | Avatar                   |     2009 |
    | Seven Samurai            |     1954 |
    | Spirited Away            |     2001 |
    | Back to the Future       |     1985 |
    | Braveheart               |     1995 |
    ```
---


#### 2. Write a SQL query to find when the movie 'American Beauty' released. Return movie release year.

- **Query:**
    ```sql
    select mov_year  from movie where mov_title =  'American Beauty';
    ```

- **Output:**
    ```
    | mov_year |
    ------------
    |     1999 |
    ```
---
#### 3. Write a SQL query to find the movie that was released in 1999. Return movie title.

- **Query:**
    ```sql
    select mov_title from movie where mov_year = 1999;
    ```

- **Output:**
    ```
    | mov_title       |
    -------------------
    | Eyes Wide Shut  |
    | American Beauty |
    ```
---
#### 4. Write a SQL query to find those movies, which were released before 1998. Return movie title.

- **Query:**
    ```sql
    select mov_title from movie where mov_year < 1998;
    ```

- **Output:**
    ```
    | mov_title                |
    ----------------------------
    | Vertigo                  |
    | The Innocents            |
    | Lawrence of Arabia       |
    | The Deer Hunter          |
    | Amadeus                  |
    | Blade Runner             |
    | The Usual Suspects       |
    | Chinatown                |
    | Boogie Nights            |
    | Annie Hall               |
    | Princess Mononoke        |
    | The Shawshank Redemption |
    | Titanic                  |
    | Good Will Hunting        |
    | Deliverance              |
    | Trainspotting            |
    | Aliens                   |
    | Seven Samurai            |
    | Back to the Future       |
    | Braveheart               |
    ```
---
#### 5. Write a SQL query to find the name of all reviewers and movies together in a single list.

- **Query:**
    ```sql
    select rev_name as name
    from movie_reviewer
    union
    select mov_title as name
    from movie;
    ```

- **Output:**
    ```
    | name                     |
    ----------------------------
    | Righty Sock              |
    | Jack Malvern             |
    | Flagrant Baronessa       |
    | Alec Shaw                |
    | NULL                     |
    | Victor Woeltjen          |
    | Simon Wright             |
    | Neal Wruck               |
    | Paul Monks               |
    | Mike Salvati             |
    | Wesley S. Walker         |
    | Sasha Goldshtein         |
    | Josh Cates               |
    | Krug Stillo              |
    | Scott LeBrun             |
    | Hannah Steele            |
    | Vincent Cadena           |
    | Brandt Sponseller        |
    | Richard Adams            |
    | Vertigo                  |
    | The Innocents            |
    | Lawrence of Arabia       |
    | The Deer Hunter          |
    | Amadeus                  |
    | Blade Runner             |
    | Eyes Wide Shut           |
    | The Usual Suspects       |
    | Chinatown                |
    | Boogie Nights            |
    | Annie Hall               |
    | Princess Mononoke        |
    | The Shawshank Redemption |
    | American Beauty          |
    | Titanic                  |
    | Good Will Hunting        |
    | Deliverance              |
    | Trainspotting            |
    | The Prestige             |
    | Donnie Darko             |
    | Slumdog Millionaire      |
    | Aliens                   |
    | Beyond the Sea           |
    | Avatar                   |
    | Seven Samurai            |
    | Spirited Away            |
    | Back to the Future       |
    | Braveheart               |
    ```
---
#### 6. Write a SQL query to find all reviewers who have rated seven or more stars to their rating. Return reviewer name.

- **Query:**
    ```sql
    select movie_reviewer.rev_name 
    from movie_rating 
    inner join movie_reviewer 
    on movie_rating.rev_id = movie_reviewer.rev_id 
    where rev_stars >= 7;
    ```


- **Output:**
    ```
    | rev_name           |
    ----------------------
    | Righty Sock        |
    | Jack Malvern       |
    | Flagrant Baronessa |
    | NULL               |
    | Simon Wright       |
    | Mike Salvati       |
    | NULL               |
    | Sasha Goldshtein   |
    | Righty Sock        |
    | Hannah Steele      |
    | Vincent Cadena     |
    | Brandt Sponseller  |
    | Victor Woeltjen    |
    | Krug Stillo        |
    ```
---
#### 7. Write a SQL query to find the movies without any rating. Return movie title.

- **Query:**
    ```sql
    select m.mov_title
    from movie m
    left join movie_rating mr 
    on m.mov_id = mr.mov_id
    where mr.mov_id is null;
    ```

- **Output:**
    ```

    | mov_title                |
    ----------------------------
    | The Deer Hunter          |
    | Amadeus                  |
    | Eyes Wide Shut           |
    | The Shawshank Redemption |
    | Deliverance              |
    | The Prestige             |
    | Spirited Away            |
    | Back to the Future       |
    | Braveheart               |

    ```
---
#### 8. Write a SQL query to find the movies with ID 905 or 907 or 917. Return movie title.

- **Query:**
    ```sql
    select movie.mov_title 
    from movie 
    where mov_id = 905 
    or mov_id = 907 
    or mov_id = 917;
    ```

- **Output:**
    ```
    Empty set 
    ```
---
#### 9. Write a SQL query to find the movie titles that contain the word 'Boogie Nights'. Sort the result-set in ascending order by movie year. Return movie ID, movie title and movie release year.

- **Query:**
    ```sql
    select movie.mov_title , movie.mov_year , movie.mov_id 
    from movie 
    where movie.mov_title like '%Boogie Nights%' 
    order by movie.mov_year ;
    ```

- **Output:**
    ```
    | mov_title     | mov_year | mov_id |
    -------------------------------------
    | Boogie Nights |     1997 |     10 |
    ```
---
#### 10. Write a SQL query to find those actors with the first name 'Woody' and the last name 'Allen'. Return actor ID.

- **Query:**
    ```sql
    select actor.act_id 
    from actor 
    where actor.act_fname= 'Woody'  
    AND actor.act_lname= 'Allen';
    ```


- **Output:**
    ```
    | act_id |
    ----------
    |     11 |
    ```
---
#### 11. Write a SQL query to find the actors who played a role in the movie 'Annie Hall'. Return all the fields of actor table.

- **Query:**
    ```sql
    select actor.act_id , actor.act_fname , actor.act_lname , actor.act_gender 
    from actor 
    where actor.act_id =  (select actor.act_id 
    from actor 
    inner join movie_cast 
    on actor.act_id = movie_cast.act_id 
    where movie_cast.mov_id = (select movie.mov_id 
    from movie 
    where movie.mov_title = 'Annie Hall'));
    ```

- **Output:**
    ```
    | act_id | act_fname | act_lname | act_gender |
    -----------------------------------------------
    |     11 | Woody     | Allen     | M          |
    ```
---
#### 12. Write a SQL query to find the director of a film that cast a role in 'Eyes Wide Shut'. Return director first name, last name.

- **Query:**
    ```sql
    select director.dir_fname  , director.dir_lname  
    from movie_direction 
    inner join director 
    on director.dir_id = movie_direction.dir_id 
    where movie_direction.dir_id = (select movie.mov_id 
    from movie 
    where movie.mov_title = 'Eyes Wide Shut');
    ```

- **Output:**
    ```
    | dir_fname | dir_lname |
    -------------------------
    | Stanley   | Kubrick   |
    ```
---
#### 13. Write a SQL query to find those movies that have been released in countries other than the United Kingdom. Return movie title, movie year, movie time, and date of release, releasing country.

- **Query:**
    ```sql
    select movie.mov_title ,movie.mov_year ,  movie.mov_time ,  movie.mov_dt_rel , movie.mov_rel_country 
    from movie 
    where movie.mov_id NOT IN (select movie.mov_id 
    from movie 
    where movie.mov_rel_country = 'UK');
    ```

- **Output:**
    ```
    | mov_title     | mov_year | mov_time | mov_dt_rel | mov_rel_country |
    ----------------------------------------------------------------------
    | The Innocents |     1961 |      100 | 1962-02-19 | SW              |
    | Annie Hall    |     1977 |       93 | 1977-04-20 | USA             |
    | Seven Samurai |     1954 |      207 | 1954-04-26 | JP              |
    ```
---
#### 14. Write a SQL query to find for movies whose reviewer is unknown. Return movie title, year, release date, director first name, last name, actor first name, last name.

- **Query:**
    ```sql
    select m.mov_title, m.mov_year, m.mov_dt_rel, d.dir_fname, d.dir_lname, a.act_fname, a.act_lname
    from movie m
    join movie_direction md 
    on m.mov_id = md.mov_id
    join director d 
    on md.dir_id = d.dir_id
    join movie_cast mc 
    on m.mov_id = mc.mov_id
    join actor a 
    on mc.act_id = a.act_id
    left join movie_rating mr 
    on m.mov_id = mr.mov_id
    left join movie_reviewer r 
    on mr.rev_id = r.rev_id
    where r.rev_id is null;
    ```
- **Output:**
    ```
    | mov_title                | mov_year | mov_dt_rel | dir_fname | dir_lname | act_fname | act_lname |
    ----------------------------------------------------------------------------------------------------
    | The Deer Hunter          |     1978 | 1979-03-08 | Michael   | Cimino    | Robert    | De Niro   |
    | Amadeus                  |     1984 | 1985-01-07 | Milos     | Forman    | F. Murray | Abraham   |
    | Eyes Wide Shut           |     1999 | NULL       | Stanley   | Kubrick   | Nicole    | Kidman    |
    | The Shawshank Redemption |     1994 | 1995-02-17 | Frank     | Darabont  | Tim       | Robbins   |
    | Deliverance              |     1972 | 1982-10-05 | John      | Boorman   | Jon       | Voight    |
    ```

---

#### 15. Write a SQL query to find those movies directed by the director whose first name is Woddy and last name is Allen. Return movie title.

- **Query:**
    ```sql
    select movie.mov_title 
    from movie movie 
    inner join movie_direction 
    on movie.mov_id = movie_direction.mov_id 
    where movie_direction.dir_id = (select director.dir_id 
    from director 
    inner join movie_direction 
    on director.dir_id = movie_direction.dir_id 
    where director.dir_fname = 'Woody' 
    AND director.dir_lname = 'Allen' ) ;
    ```


- **Output:**
    ```
    +------------+
    | mov_title  |
    +------------+
    | Annie Hall |
    +------------+
    ```
---


#### 16. Write a SQL query to determine those years in which there was at least one movie that received a rating of at least three stars. Sort the result-set in ascending order by movie year. Return movie year.

- **Query:**
    ```sql
    select movie.mov_year 
    from movie 
    inner join movie_rating 
    on movie.mov_id = movie_rating.mov_id 
    where movie.mov_year in (select movie.mov_year 
    from movie 
    group by movie.mov_year 
    having count(movie.mov_id) >= 1) 
    and movie_rating.rev_stars >= 3 
    order by movie.mov_year  ;
    ```

- **Output:**
    ```
    +----------+
    | mov_year |
    +----------+
    |     1954 |
    |     1958 |
    |     1961 |
    |     1962 |
    |     1977 |
    |     1982 |
    |     1986 |
    |     1995 |
    |     1997 |
    |     1997 |
    |     1997 |
    |     1997 |
    |     1999 |
    |     2001 |
    |     2004 |
    |     2008 |
    |     2009 |
    +----------+
    ```
---

#### 17. Write a SQL query to search for movies that do not have any ratings. Return movie title.

- **Query:**
    ```sql
    select movie.mov_title 
    from movie 
    where movie.mov_id in (
    select movie.mov_id 
    from movie 
    left join movie_rating 
    on movie.mov_id = movie_rating.mov_id 
    where movie.mov_id = null
    );
    ```

- **Output:**
    ```
    empty set
    ```
---

#### 18. Write a SQL query to find those reviewers who have not given a rating to certain films. Return reviewer name.

- **Query:**
    ```sql
    select r.rev_name
    from movie_reviewer r
    where exists (
    select 1
    from movie m
    where not exists (
    select 1
    from movie_rating mr
    where mr.mov_id = m.mov_id
    and mr.rev_id = r.rev_id
    )
    );
    ```


- **Output:**
    ```
    +--------------------+
    | rev_name           |
    +--------------------+
    | Righty Sock        |
    | Jack Malvern       |
    | Flagrant Baronessa |
    | Alec Shaw          |
    | NULL               |
    | Victor Woeltjen    |
    | Simon Wright       |
    | Neal Wruck         |
    | Paul Monks         |
    | Mike Salvati       |
    | NULL               |
    | Wesley S. Walker   |
    | Sasha Goldshtein   |
    | Josh Cates         |
    | Krug Stillo        |
    | Scott LeBrun       |
    | Hannah Steele      |
    | Vincent Cadena     |
    | Brandt Sponseller  |
    | Richard Adams      |
    +--------------------+

    ```

---

#### 19. Write a SQL query to find movies that have been reviewed by a reviewer and received a rating. Sort the result-set in ascending order by reviewer name, movie title, review Stars. Return reviewer name, movie title, review Stars.

- **Query:**
    ```sql
    select r.rev_name,m.mov_title,mr.rev_stars
    from movie_reviewer r
    inner join movie_rating mr on r.rev_id=mr.rev_id
    inner join movie m on m.mov_id=mr.mov_id
    order by r.rev_name,m.mov_title,mr.rev_stars;

    ```

- **Output:**
    ```
    +--------------------+---------------------+-----------+
    | rev_name           | mov_title           | rev_stars |
    +--------------------+---------------------+-----------+
    | NULL               | Blade Runner        |       8.2 |
    | NULL               | Princess Mononoke   |       8.4 |
    | Brandt Sponseller  | Aliens              |       8.4 |
    | Flagrant Baronessa | Lawrence of Arabia  |       8.3 |
    | Hannah Steele      | Donnie Darko        |       8.1 |
    | Jack Malvern       | The Innocents       |       7.9 |
    | Josh Cates         | Good Will Hunting   |       4.0 |
    | Krug Stillo        | Seven Samurai       |       7.7 |
    | Mike Salvati       | Annie Hall          |       8.1 |
    | Neal Wruck         | Chinatown           |      NULL |
    | Paul Monks         | Boogie Nights       |       3.0 |
    | Richard Adams      | Beyond the Sea      |       6.7 |
    | Righty Sock        | Titanic             |       7.7 |
    | Righty Sock        | Vertigo             |       8.4 |
    | Sasha Goldshtein   | American Beauty     |       7.0 |
    | Scott LeBrun       | Trainspotting       |      NULL |
    | Simon Wright       | The Usual Suspects  |       8.6 |
    | Victor Woeltjen    | Avatar              |       7.3 |
    | Vincent Cadena     | Slumdog Millionaire |       8.0 |
    +--------------------+---------------------+-----------+
    ```

---

#### 20. Write a SQL query to find movies that have been reviewed by a reviewer and received a rating. Group the result set on reviewer's name, movie title. Return reviewer's name, movie title.

- **Query:**
    ```sql
    select r.rev_name  , m.mov_title 
    from movie_reviewer r 
    inner join movie_rating mr 
    on mr.rev_id = r.rev_id
    inner join movie m 
    on m.mov_id = mr.mov_id
    group by r.rev_name , m.mov_title 
    having count(mr.rev_id)> 0 ;
    ```

- **Output:**
    ```
    +--------------------+---------------------+
    | rev_name           | mov_title           |
    +--------------------+---------------------+
    | Righty Sock        | Vertigo             |
    | Righty Sock        | Titanic             |
    | Jack Malvern       | The Innocents       |
    | Flagrant Baronessa | Lawrence of Arabia  |
    | NULL               | Blade Runner        |
    | Victor Woeltjen    | Avatar              |
    | Simon Wright       | The Usual Suspects  |
    | Neal Wruck         | Chinatown           |
    | Paul Monks         | Boogie Nights       |
    | Mike Salvati       | Annie Hall          |
    | NULL               | Princess Mononoke   |
    | Sasha Goldshtein   | American Beauty     |
    | Josh Cates         | Good Will Hunting   |
    | Krug Stillo        | Seven Samurai       |
    | Scott LeBrun       | Trainspotting       |
    | Hannah Steele      | Donnie Darko        |
    | Vincent Cadena     | Slumdog Millionaire |
    | Brandt Sponseller  | Aliens              |
    | Richard Adams      | Beyond the Sea      |
    +--------------------+---------------------+
    ```

---

#### 21. Write a SQL query to find those movies, which have received highest number of stars. Group the result set on movie title and sorts the result-set in ascending order by movie title. Return movie title and maximum number of review stars.

- **Query:**
    ```sql
    select m.mov_title , MAX(mr.rev_stars) 
    from movie m 
    inner join movie_rating mr 
    on m.mov_id = mr.mov_id
    where mr.rev_stars = (
    select max(rev_stars)
    from movie_rating  
    ) 
    group by m.mov_title
    order by m.mov_title;
    ```

- **Output:**
    ```
    +--------------------+-------------------+
    | mov_title          | MAX(mr.rev_stars) |
    +--------------------+-------------------+
    | The Usual Suspects |               8.6 |
    +--------------------+-------------------+
    ```
---
#### 22. Write a SQL query to find all reviewers who rated the movie 'American Beauty'. Return reviewer name.

- **Query:**
    ```sql
    select r.rev_name 
    from movie_reviewer r
    inner join movie_rating mr 
    on mr.rev_id = r.rev_id
    inner join movie m 
    on mr.mov_id = m.mov_id
    where m.mov_title = 'American Beauty' ;
    ```

- **Output:**
    ```
    +------------------+
    | rev_name         |
    +------------------+
    | Sasha Goldshtein |
    +------------------+
    ```
---
#### 23. Write a SQL query to find the movies that have not been reviewed by any reviewer body other than 'Paul Monks'. Return movie title.

- **Query:**
    ```sql
    select m.mov_title
    from movie m 
    inner join movie_rating mr
    on m.mov_id = mr.mov_id
    inner join movie_reviewer r
    on r.rev_id = mr.rev_id
    where r.rev_name not in (
    select rev_name 
    from movie_reviewer
    where rev_name = 'Paul Monks' 
    );
    ```

- **Output:**
    ```
    +---------------------+
    | mov_title           |
    +---------------------+
    | Vertigo             |
    | Titanic             |
    | The Innocents       |
    | Lawrence of Arabia  |
    | Avatar              |
    | The Usual Suspects  |
    | Chinatown           |
    | Annie Hall          |
    | American Beauty     |
    | Good Will Hunting   |
    | Seven Samurai       |
    | Trainspotting       |
    | Donnie Darko        |
    | Slumdog Millionaire |
    | Aliens              |
    | Beyond the Sea      |
    +---------------------+
    ```
---

#### 24. Write a SQL query to find the movies with the lowest ratings. Return reviewer name, movie title, and number of stars for those movies.

- **Query:**
    ```sql
    select r.rev_name , m.mov_title , mr.rev_stars
    from movie m
    inner join movie_rating mr 
    on mr.mov_id = m.mov_id
    inner join movie_reviewer r
    on mr.rev_id = r.rev_id
    where num_o_ratings = (
    select min(num_o_ratings)
    from movie_rating
    );
    ```

- **Output:**
    ```
    +---------------+----------------+-----------+
    | rev_name      | mov_title      | rev_stars |
    +---------------+----------------+-----------+
    | Richard Adams | Beyond the Sea |       6.7 |
    +---------------+----------------+-----------+
    ```
---

#### 25. Write a SQL query to find the movies directed by 'James Cameron'. Return movie title.

- **Query:**
    ```sql
    select m.mov_title 
    from movie m 
    inner join movie_direction md
    on m.mov_id = md.mov_id
    inner join director d
    on d.dir_id = md.dir_id
    where d.dir_fname = 'James'
    and d.dir_lname = 'Cameron';
    ```

- **Output:**
    ```
    +-----------+
    | mov_title |
    +-----------+
    | Titanic   |
    | Aliens    |
    +-----------+
    ```
---
#### 26. Write a query in SQL to find the movies in which one or more actors appeared in more than one film.

- **Query:**
    ```sql
    select distinct m.mov_title
    from movie m
    join movie_cast mc 
    on m.mov_id = mc.mov_id
    where mc.act_id in (
    select act_id
    from movie_cast
    group by act_id
    having count(distinct mov_id) > 1
    );
    ```

- **Output:**
    ```
    +-----------------+
    | mov_title       |
    +-----------------+
    | American Beauty |
    | Beyond the Sea  |
    +-----------------+
    ```
---

#### 27. Write a SQL query to find all reviewers whose ratings contain a NULL value. Return reviewer name.

- **Query:**
    ```sql
    select r.rev_name
    from movie_reviewer r
    where r.rev_id not in  (
    select r.rev_id 
    from movie_reviewer r
    inner join movie_rating mr
    on r.rev_id = mr.rev_id
    );
    ```

- **Output:**
    ```
    | rev_name         |
    |------------------|
    | Alec Shaw        |
    | Wesley S. Walker |

    ```
---

#### 28. Write a SQL query to find out who was cast in the movie 'Annie Hall'. Return actor first name, last name and role.

- **Query:**
    ```sql
    select a.act_fname , a.act_lname , mc.role
    from actor a
    inner join movie_cast mc
    on a.act_id = mc.act_id
    inner join movie m 
    on m.mov_id = mc.mov_id
    where m.mov_title = 'Annie Hall';
    ```

- **Output:**
    ```
    +-----------+-----------+-------------+
    | act_fname | act_lname | role        |
    +-----------+-----------+-------------+
    | Woody     | Allen     | Alvy Singer |
    +-----------+-----------+-------------+
    ```
---

#### 29. Write a SQL query to find the director who directed a movie that featured a role in 'Eyes Wide Shut'. Return director first name, last name and movie title.

- **Query:**
    ```sql
    select m.mov_title , d.dir_fname , d.dir_lname 
    from movie m 
    inner join movie_direction md
    on md.mov_id = m.mov_id
    inner join director d
    on d.dir_id = md.dir_id
    where m.mov_title = 'Eyes Wide Shut';
    ```

- **Output:**
    ```
    +----------------+-----------+-----------+
    | mov_title      | dir_fname | dir_lname |
    +----------------+-----------+-----------+
    | Eyes Wide Shut | Stanley   | Kubrick   |
    +----------------+-----------+-----------+
    ```
---
#### 30. Write a SQL query to find the director of a movie that cast a role as Sean Maguire. Return director first name, last name and movie title.

- **Query:**
    ```sql
    select m.mov_title , d.dir_fname , d.dir_lname
    from movie m 
    inner join movie_direction md
    on md.mov_id = m.mov_id
    inner join director d
    on d.dir_id = md.dir_id
    inner join movie_cast mc
    on m.mov_id = mc.mov_id
    where mc.role = 'Sean Maguire';
    ```


- **Output:**
    ```
    +-------------------+-----------+-----------+
    | mov_title         | dir_fname | dir_lname |
    +-------------------+-----------+-----------+
    | Good Will Hunting | Gus       | Van Sant  |
    +-------------------+-----------+-----------+
    ```
---
#### 31. Write a SQL query to find out which actors have not appeared in any movies between 1990 and 2000 (Begin and end values are included.). Return actor first name, last name, movie title and release year.

- **Query:**
    ```sql
    select a.act_fname,a.act_lname,m.mov_title,m.mov_year
    from actor a
    left join movie_cast mc on a.act_id=mc.act_id
    left join movie m on mc.mov_id=m.mov_id
    where a.act_id not in(
    select mc.act_id
    from movie_cast mc
    inner join movie m on mc.mov_id=m.mov_id
    where m.mov_year between 1990 and 2000
    );

    ```

- **Output:**
    ```
    +-----------+------------+---------------------+----------+
    | act_fname | act_lname  | mov_title           | mov_year |
    +-----------+------------+---------------------+----------+
    | James     | Stewart    | Vertigo             |     1958 |
    | Deborah   | Kerr       | The Innocents       |     1961 |
    | Peter     | OToole     | Lawrence of Arabia  |     1962 |
    | Robert    | De Niro    | The Deer Hunter     |     1978 |
    | F. Murray | Abraham    | Amadeus             |     1984 |
    | Harrison  | Ford       | Blade Runner        |     1982 |
    | Jack      | Nicholson  | Chinatown           |     1974 |
    | Woody     | Allen      | Annie Hall          |     1977 |
    | Jon       | Voight     | Deliverance         |     1972 |
    | Christian | Bale       | Chinatown           |     1974 |
    | Maggie    | Gyllenhaal | Donnie Darko        |     2001 |
    | Dev       | Patel      | Slumdog Millionaire |     2008 |
    | Sigourney | Weaver     | Aliens              |     1986 |
    | David     | Aston      | NULL                |     NULL |
    | Ali       | Astin      | NULL                |     NULL |
    +-----------+------------+---------------------+----------+
    ```

---
#### 32. Write a SQL query to find the directors who have directed films in a variety of genres. Group the result set on director first name, last name and generic title. Sort the result-set in ascending order by director first name and last name. Return director first name, last name and number of genres movies.

- **Query:**
    ```sql
    select d.dir_fname , d.dir_lname , count(m.mov_id) 
    from genres g 
    inner join movie_genres mg 
    on g.gen_id =  mg.gen_id
    inner join movie m 
    on mg.mov_id = m.mov_id
    inner join movie_direction md
    on md.mov_id = m.mov_id
    inner join director d
    on md.dir_id = d.dir_id 
    group by d.dir_fname  , d.dir_lname , g.gen_title
    order by d.dir_fname , d.dir_lname ;
    ```

- **Output:**
    ```
    +-----------+-----------+-----------------+
    | dir_fname | dir_lname | count(m.mov_id) |
    +-----------+-----------+-----------------+
    | Alfred    | Hitchcock |               1 |
    | Bryan     | Singer    |               1 |
    | Danny     | Boyle     |               2 |
    | David     | Lean      |               1 |
    | Frank     | Darabont  |               1 |
    | Hayao     | Miyazaki  |               1 |
    | Jack      | Clayton   |               1 |
    | James     | Cameron   |               1 |
    | John      | Boorman   |               1 |
    | Kevin     | Spacey    |               1 |
    | Michael   | Cimino    |               1 |
    | Ridley    | Scott     |               1 |
    | Sam       | Mendes    |               1 |
    | Stanley   | Kubrick   |               1 |
    | Woody     | Allen     |               1 |
    +-----------+-----------+-----------------+
    ```
---
#### 33. Write a SQL query to find the movies with year and genres. Return movie title, movie year and generic title.

- **Query:**
    ```sql
    select m.mov_title , m.mov_year , g.gen_title
    from movie m
    inner join movie_genres mg
    on m.mov_id = mg.mov_id
    inner join genres g
    on mg.gen_id = g.gen_id;
    ```

- **Output:**
    ```
    +--------------------------+----------+-----------+
    | mov_title                | mov_year | gen_title |
    +--------------------------+----------+-----------+
    | Aliens                   |     1986 | Action    |
    | Lawrence of Arabia       |     1962 | Adventure |
    | Deliverance              |     1972 | Adventure |
    | Princess Mononoke        |     1997 | Animation |
    | Annie Hall               |     1977 | Comedy    |
    | The Usual Suspects       |     1995 | Crime     |
    | The Shawshank Redemption |     1994 | Crime     |
    | Trainspotting            |     1996 | Drama     |
    | Slumdog Millionaire      |     2008 | Drama     |
    | Spirited Away            |     2001 | Drama     |
    | Braveheart               |     1995 | Drama     |
    | The Innocents            |     1961 | Horror    |
    | Beyond the Sea           |     2004 | Music     |
    | Vertigo                  |     1958 | Mystery   |
    | Eyes Wide Shut           |     1999 | Mystery   |
    | Back to the Future       |     1985 | Mystery   |
    | American Beauty          |     1999 | Romance   |
    | Blade Runner             |     1982 | Thriller  |
    | The Deer Hunter          |     1978 | War       |
    +--------------------------+----------+-----------+
    ```
---
#### 34. Write a SQL query to find all the movies with year, genres, and name of the director.

- **Query:**
    ```sql
    select * 
    from movie m 
    inner join movie_genres mg
    on m.mov_id = mg.mov_id
    inner join genres g
    on mg.gen_id = g.gen_id
    inner join movie_direction md
        ON m.mov_id = md.mov_id
    INNER JOIN director d
        ON md.dir_id = d.dir_id;
    ```

- **Output:**
    ```
    +--------+--------------------------+----------+----------+----------+------------+-----------------+--------+--------+--------+-----------+--------+--------+--------+-----------+-----------+
    | mov_id | mov_title                | mov_year | mov_time | mov_lang | mov_dt_rel | mov_rel_country | mov_id | gen_id | gen_id | gen_title | dir_id | mov_id | dir_id | dir_fname | dir_lname |
    +--------+--------------------------+----------+----------+----------+------------+-----------------+--------+--------+--------+-----------+--------+--------+--------+-----------+-----------+
    |     22 | Aliens                   |     1986 |      137 | English  | 1986-08-29 | UK              |     22 |      1 |      1 | Action    |     15 |     22 |     15 | James     | Cameron   |
    |      3 | Lawrence of Arabia       |     1962 |      216 | English  | 1962-12-11 | UK              |      3 |      2 |      2 | Adventure |      3 |      3 |      3 | David     | Lean      |
    |     17 | Deliverance              |     1972 |      109 | English  | 1982-10-05 | UK              |     17 |      2 |      2 | Adventure |     17 |     17 |     17 | John      | Boorman   |
    |     12 | Princess Mononoke        |     1997 |      134 | Japanese | 2001-10-19 | UK              |     12 |      3 |      3 | Animation |     12 |     12 |     12 | Hayao     | Miyazaki  |
    |     11 | Annie Hall               |     1977 |       93 | English  | 1977-04-20 | USA             |     11 |      5 |      5 | Comedy    |     11 |     11 |     11 | Woody     | Allen     |
    |      8 | The Usual Suspects       |     1995 |      106 | English  | 1995-08-25 | UK              |      8 |      6 |      6 | Crime     |      8 |      8 |      8 | Bryan     | Singer    |
    |     13 | The Shawshank Redemption |     1994 |      142 | English  | 1995-02-17 | UK              |     13 |      6 |      6 | Crime     |     13 |     13 |     13 | Frank     | Darabont  |
    |     18 | Trainspotting            |     1996 |       94 | English  | 1996-02-23 | UK              |     18 |      7 |      7 | Drama     |     18 |     18 |     18 | Danny     | Boyle     |
    |     21 | Slumdog Millionaire      |     2008 |      120 | English  | 2009-01-09 | UK              |     21 |      7 |      7 | Drama     |     18 |     21 |     18 | Danny     | Boyle     |
    |      2 | The Innocents            |     1961 |      100 | English  | 1962-02-19 | SW              |      2 |      8 |      8 | Horror    |      2 |      2 |      2 | Jack      | Clayton   |
    |     23 | Beyond the Sea           |     2004 |      118 | English  | 2004-11-26 | UK              |     23 |      9 |      9 | Music     |     21 |     23 |     21 | Kevin     | Spacey    |
    |      1 | Vertigo                  |     1958 |      128 | English  | 1958-08-24 | UK              |      1 |     10 |     10 | Mystery   |      1 |      1 |      1 | Alfred    | Hitchcock |
    |      7 | Eyes Wide Shut           |     1999 |      159 | English  | NULL       | UK              |      7 |     10 |     10 | Mystery   |      7 |      7 |      7 | Stanley   | Kubrick   |
    |     14 | American Beauty          |     1999 |      122 | English  | NULL       | UK              |     14 |     11 |     11 | Romance   |     14 |     14 |     14 | Sam       | Mendes    |
    |      6 | Blade Runner             |     1982 |      117 | English  | 1982-09-09 | UK              |      6 |     12 |     12 | Thriller  |      6 |      6 |      6 | Ridley    | Scott     |
    |      4 | The Deer Hunter          |     1978 |      183 | English  | 1979-03-08 | UK              |      4 |     13 |     13 | War       |      4 |      4 |      4 | Michael   | Cimino    |
    +--------+--------------------------+----------+----------+----------+------------+-----------------+--------+--------+--------+-----------+--------+--------+--------+-----------+-----------+
    ```
---
#### 35. Write a SQL query to find the movies released before 1st January 1989. Sort the result-set in descending order by date of release. Return movie title, release year, date of release, duration, and first and last name of the director.

- **Query:**
    ```sql
    select m.mov_title , m.mov_year , m.mov_dt_rel, m.mov_time, d.dir_fname , d.dir_lname 
    from movie m 
    inner join movie_direction md
    on m.mov_id = md.mov_id
    inner join director d
    on d.dir_id = md.dir_id
    where 	m.mov_dt_rel < '1989-01-01'
    order by m.mov_dt_rel DESC;
    ```
- **Output:**
    ```
    +--------------------+----------+------------+----------+-----------+-----------+
    | mov_title          | mov_year | mov_dt_rel | mov_time | dir_fname | dir_lname |
    +--------------------+----------+------------+----------+-----------+-----------+
    | Aliens             |     1986 | 1986-08-29 |      137 | James     | Cameron   |
    | Amadeus            |     1984 | 1985-01-07 |      160 | Milos     | Forman    |
    | Deliverance        |     1972 | 1982-10-05 |      109 | John      | Boorman   |
    | Blade Runner       |     1982 | 1982-09-09 |      117 | Ridley    | Scott     |
    | The Deer Hunter    |     1978 | 1979-03-08 |      183 | Michael   | Cimino    |
    | Annie Hall         |     1977 | 1977-04-20 |       93 | Woody     | Allen     |
    | Chinatown          |     1974 | 1974-08-09 |      130 | Roman     | Polanski  |
    | Lawrence of Arabia |     1962 | 1962-12-11 |      216 | David     | Lean      |
    | The Innocents      |     1961 | 1962-02-19 |      100 | Jack      | Clayton   |
    | Vertigo            |     1958 | 1958-08-24 |      128 | Alfred    | Hitchcock |
    +--------------------+----------+------------+----------+-----------+-----------+
    ```

---
#### 36. Write a SQL query to calculate the average movie length and count the number of movies in each genre. Return genre title, average time and number of movies for each genre.

- **Query:**
    ```sql
    select g.gen_title , AVG(m.mov_time) , count(m.mov_id)
    from movie m 
    inner join movie_genres mg 
    on mg.mov_id = m.mov_id
    inner join genres g
    on g.gen_id = mg.gen_id
    group by g.gen_id;
    ```

- **Output:**
    ```
    +-----------+-----------------+-----------------+
    | gen_title | AVG(m.mov_time) | count(m.mov_id) |
    +-----------+-----------------+-----------------+
    | Action    |        137.0000 |               1 |
    | Adventure |        162.5000 |               2 |
    | Animation |        134.0000 |               1 |
    | Comedy    |         93.0000 |               1 |
    | Crime     |        124.0000 |               2 |
    | Drama     |        129.2500 |               4 |
    | Horror    |        100.0000 |               1 |
    | Music     |        118.0000 |               1 |
    | Mystery   |        134.3333 |               3 |
    | Romance   |        122.0000 |               1 |
    | Thriller  |        117.0000 |               1 |
    | War       |        183.0000 |               1 |
    +-----------+-----------------+-----------------+
    ```
---
#### 37. Write a SQL query to find movies with the shortest duration. Return movie title, movie year, director first name, last name, actor first name, last name and role.

- **Query:**
    ```sql
    select m.mov_title , m.mov_year , d.dir_fname , d.dir_lname , a.act_fname , a.act_lname ,  mc.role
    from movie m 
    inner join movie_direction md
    on md.mov_id = m.mov_id
    inner join director d
    on d.dir_id = md.dir_id
    inner join movie_cast mc
    on mc.mov_id = m.mov_id
    inner join actor a
    on a.act_id = mc.act_id
    where m.mov_time = (
    select min(mov_time) from movie
    );
    ```

- **Output:**
    ```
    +------------+----------+-----------+-----------+-----------+-----------+-------------+
    | mov_title  | mov_year | dir_fname | dir_lname | act_fname | act_lname | role        |
    +------------+----------+-----------+-----------+-----------+-----------+-------------+
    | Annie Hall |     1977 | Woody     | Allen     | Woody     | Allen     | Alvy Singer |
    +------------+----------+-----------+-----------+-----------+-----------+-------------+
    ```
---
#### 38. Write a SQL query to find the years in which a movie received a rating of 3 or 4. Sort the result in increasing order on movie year.

- **Query:**
    ```sql
    select * 
    from movie m 
    inner join movie_rating mr
    on mr.mov_id = m.mov_id
    where mr.rev_stars = 3 
    or mr.rev_stars = 4
    order by m.mov_year ;
    ```
- **Output:**
    ```
    +--------+-------------------+----------+----------+----------+------------+-----------------+--------+--------+-----------+---------------+
    | mov_id | mov_title         | mov_year | mov_time | mov_lang | mov_dt_rel | mov_rel_country | mov_id | rev_id | rev_stars | num_o_ratings |
    +--------+-------------------+----------+----------+----------+------------+-----------------+--------+--------+-----------+---------------+
    |     10 | Boogie Nights     |     1997 |      155 | English  | 1998-02-16 | UK              |     10 |      9 |       3.0 |        195961 |
    |     16 | Good Will Hunting |     1997 |      126 | English  | 1998-06-03 | UK              |     16 |     14 |       4.0 |        642132 |
    +--------+-------------------+----------+----------+----------+------------+-----------------+--------+--------+-----------+---------------+
    ```

---
#### 39. Write a SQL query to get the reviewer name, movie title, and stars in an order that reviewer name will come first, then by movie title, and lastly by number of stars.

- **Query:**
    ```sql
    select r.rev_name, m.mov_title, mr.rev_stars
    from movie_reviewer r
    join movie_rating mr 
    on r.rev_id = mr.rev_id
    join movie m 
    on mr.mov_id = m.mov_id
    order by r.rev_name, m.mov_title, mr.rev_stars;
    ```

-   **Output:**
    ```
    +--------------------+---------------------+-----------+
    | rev_name           | mov_title           | rev_stars |
    +--------------------+---------------------+-----------+
    | NULL               | Blade Runner        |       8.2 |
    | NULL               | Princess Mononoke   |       8.4 |
    | Brandt Sponseller  | Aliens              |       8.4 |
    | Flagrant Baronessa | Lawrence of Arabia  |       8.3 |
    | Hannah Steele      | Donnie Darko        |       8.1 |
    | Jack Malvern       | The Innocents       |       7.9 |
    | Josh Cates         | Good Will Hunting   |       4.0 |
    | Krug Stillo        | Seven Samurai       |       7.7 |
    | Mike Salvati       | Annie Hall          |       8.1 |
    | Neal Wruck         | Chinatown           |      NULL |
    | Paul Monks         | Boogie Nights       |       3.0 |
    | Richard Adams      | Beyond the Sea      |       6.7 |
    | Righty Sock        | Titanic             |       7.7 |
    | Righty Sock        | Vertigo             |       8.4 |
    | Sasha Goldshtein   | American Beauty     |       7.0 |
    | Scott LeBrun       | Trainspotting       |      NULL |
    | Simon Wright       | The Usual Suspects  |       8.6 |
    | Victor Woeltjen    | Avatar              |       7.3 |
    | Vincent Cadena     | Slumdog Millionaire |       8.0 |
    +--------------------+---------------------+-----------+
    ```
---
#### 40. Write a SQL query to find those movies that have at least one rating and received the most stars. Sort the result-set on movie title. Return movie title and maximum review stars.

- **Query:**
    ```sql
    select m.mov_title , max(mr.rev_stars)
    from movie m 
    inner join movie_rating mr
    on m.mov_id = mr.mov_id
    where mr.num_o_ratings >= 1
    and mr.rev_stars =  (
    select max(rev_stars) from movie_rating
    )
    group by mr.mov_id
    order by m.mov_title ;
    ```

- **Output**
    ```
    +--------------------+-------------------+
    | mov_title          | max(mr.rev_stars) |
    +--------------------+-------------------+
    | The Usual Suspects |               8.6 |
    +--------------------+-------------------+
    ```
---
#### 41. Write a SQL query to find out which movies have received ratings. Return movie title, director first name, director last name and review stars.

- **Query:**
    ```sql
    select m.mov_title , d.dir_fname , d.dir_lname , mr.rev_stars
    from movie m 
    inner join movie_rating mr
    on mr.mov_id = m.mov_id
    inner join movie_direction md
    on md.mov_id = m.mov_id
    inner join director d
    on d.dir_id = md.dir_id;
    ```

- **Output**
    ```
    +---------------------+-----------+-----------------+-----------+
    | mov_title           | dir_fname | dir_lname       | rev_stars |
    +---------------------+-----------+-----------------+-----------+
    | Vertigo             | Alfred    | Hitchcock       |       8.4 |
    | The Innocents       | Jack      | Clayton         |       7.9 |
    | Lawrence of Arabia  | David     | Lean            |       8.3 |
    | Blade Runner        | Ridley    | Scott           |       8.2 |
    | The Usual Suspects  | Bryan     | Singer          |       8.6 |
    | Chinatown           | Roman     | Polanski        |      NULL |
    | Boogie Nights       | Paul      | Thomas Anderson |       3.0 |
    | Annie Hall          | Woody     | Allen           |       8.1 |
    | Princess Mononoke   | Hayao     | Miyazaki        |       8.4 |
    | American Beauty     | Sam       | Mendes          |       7.0 |
    | Titanic             | James     | Cameron         |       7.7 |
    | Good Will Hunting   | Gus       | Van Sant        |       4.0 |
    | Trainspotting       | Danny     | Boyle           |      NULL |
    | Donnie Darko        | Richard   | Kelly           |       8.1 |
    | Slumdog Millionaire | Danny     | Boyle           |       8.0 |
    | Aliens              | James     | Cameron         |       8.4 |
    | Beyond the Sea      | Kevin     | Spacey          |       6.7 |
    +---------------------+-----------+-----------------+-----------+
    ```
---
#### 42. Write a SQL query to find movies in which one or more actors have acted in more than one film. Return movie title, actor first and last name, and the role.

- **Query:**
    ```sql
    select m.mov_title, a.act_fname, a.act_lname, mc.role
    from movie m
    join movie_cast mc 
    on m.mov_id = mc.mov_id
    join actor a 
    on mc.act_id = a.act_id
    where a.act_id in (
    select act_id
    from movie_cast
    group by act_id
    having count(distinct mov_id) > 1
    );
    ```
- **Output**
    ```
    +-----------------+-----------+-----------+----------------+
    | mov_title       | act_fname | act_lname | role           |
    +-----------------+-----------+-----------+----------------+
    | American Beauty | Kevin     | Spacey    | Lester Burnham |
    | Beyond the Sea  | Kevin     | Spacey    | Bobby Darin    |
    +-----------------+-----------+-----------+----------------+
    ```

---
#### 43. Write a SQL query to find the actor whose first name is 'Claire' and last name is 'Danes'. Return director first name, last name, movie title, actor first name and last name, role.

- **Query:**
    ```sql
    select d.dir_fname , d.dir_lname , m.mov_title , a.act_fname , a.act_lname , mc.role
    from movie m 
    inner join movie_direction md
    on md.mov_id = m.mov_id
    inner join director d
    on d.dir_id = md.dir_id
    inner join movie_cast mc
    on mc.mov_id = m.mov_id
    inner join actor a 
    on a.act_id = mc.act_id
    where a.act_fname = 'Claire'
    and a.act_lname = 'Danes';
    ```

- **Output**
    ```
    +-----------+-----------+-------------------+-----------+-----------+------+
    | dir_fname | dir_lname | mov_title         | act_fname | act_lname | role |
    +-----------+-----------+-------------------+-----------+-----------+------+
    | Hayao     | Miyazaki  | Princess Mononoke | Claire    | Danes     | San  |
    +-----------+-----------+-------------------+-----------+-----------+------+
    ```
---
#### 44. Write a SQL query to find for actors whose films have been directed by them. Return actor first name, last name, movie title and role.

- **Query:**
    ```sql
    select a.act_fname , a.act_lname , 	m.mov_title , mc.role
    from movie m 
    inner join movie_direction md
    on md.mov_id = m.mov_id
    inner join director d
    on d.dir_id = md.dir_id
    inner join movie_cast mc
    on mc.mov_id = m.mov_id
    inner join actor a 
    on a.act_id = mc.act_id
    where a.act_fname = d.dir_fname
    and a.act_lname = d.dir_lname;
    ```

- **Output**
    ```
    +-----------+-----------+----------------+-------------+
    | act_fname | act_lname | mov_title      | role        |
    +-----------+-----------+----------------+-------------+
    | Woody     | Allen     | Annie Hall     | Alvy Singer |
    | Kevin     | Spacey    | Beyond the Sea | Bobby Darin |
    +-----------+-----------+----------------+-------------+
    ```

---
#### 45. Write a SQL query to find the cast list of the movie 'Chinatown'. Return first name, last name.

- **Query:**
    ```sql
    select a.act_fname , a.act_lname
    from movie m
    inner join movie_cast mc
    on mc.mov_id = m.mov_id
    inner join actor a 
    on a.act_id = mc.act_id
    where m.mov_title = 'Chinatown';
    ```

- **Output**
    ```
    +-----------+-----------+
    | act_fname | act_lname |
    +-----------+-----------+
    | Jack      | Nicholson |
    | Christian | Bale      |
    +-----------+-----------+
    ```
---
#### 46. Write a SQL query to find those movies where actor's first name is 'Harrison' and last name is 'Ford'. Return movie title.

- **Query:**
    ```sql
    select m.mov_title
    from movie m
    inner join movie_cast mc
    on mc.mov_id = m.mov_id
    inner join actor a 
    on a.act_id = mc.act_id
    where a.act_fname = 'Harrison'
    and a.act_lname = 'Ford' ;
    ```
- **Output**
    ```
    +--------------+
    | mov_title    |
    +--------------+
    | Blade Runner |
    +--------------+
    ```

---
#### 47. Write a SQL query to find the highest-rated movies. Return movie title, movie year, review stars and releasing country.

- **Query:**
    ```sql
    select m.mov_title , m.mov_year , mr.rev_stars , m.mov_rel_country
    from movie m 
    inner join movie_rating mr
    on mr.mov_id = m.mov_id
    where mr.rev_stars = (
    select max(rev_stars) from movie_rating
    );
    ```

- **Output**
    ```
    +--------------------+----------+-----------+-----------------+
    | mov_title          | mov_year | rev_stars | mov_rel_country |
    +--------------------+----------+-----------+-----------------+
    | The Usual Suspects |     1995 |       8.6 | UK              |
    +--------------------+----------+-----------+-----------------+
    ```
---
#### 48. Write a SQL query to find the highest-rated 'Mystery Movies'. Return the title, year, and rating.

- **Query:**
    ```sql
    SELECT m.mov_title,m.mov_year,mr.rev_stars
    FROM movie m
    JOIN movie_rating mr
    ON m.mov_id = mr.mov_id
    JOIN movie_genres mg
    ON m.mov_id = mg.mov_id
    JOIN genres g
    ON mg.gen_id = g.gen_id
    WHERE g.gen_title = 'Mystery'
    AND mr.rev_stars = (
    SELECT MAX(mr2.rev_stars)
    FROM movie_rating mr2
    JOIN movie_genres mg2 ON mr2.mov_id = mg2.mov_id
    JOIN genres g2 ON mg2.gen_id = g2.gen_id
    WHERE g2.gen_title = 'Mystery'
    );
    ```

- **Output**
    ```
    +-----------+----------+-----------+
    | mov_title | mov_year | rev_stars |
    +-----------+----------+-----------+
    | Vertigo   |     1958 |       8.4 |
    +-----------+----------+-----------+
    ```
---
#### 49. Write a SQL query to find the years when most of the 'Mystery Movies' produced. Count the number of generic title and compute their average rating. Group the result set on movie release year, generic title. Return movie year, generic title, number of generic title and average rating.

- **Query:**
    ```sql
    SELECT m.mov_year,g.gen_title,COUNT(m.mov_id) AS movie_count,AVG(mr.rev_stars) AS avg_rating
    FROM movie m
    JOIN movie_genres mg
    ON m.mov_id = mg.mov_id
    JOIN genres g
    ON mg.gen_id = g.gen_id
    JOIN movie_rating mr
    ON m.mov_id = mr.mov_id
    WHERE g.gen_title = 'Mystery'
    GROUP BY m.mov_year, g.gen_title
    ORDER BY movie_count DESC;
    ```

- **Output**
    ```
    +----------+-----------+-------------+------------+
    | mov_year | gen_title | movie_count | avg_rating |
    +----------+-----------+-------------+------------+
    |     1958 | Mystery   |           1 |    8.40000 |
    +----------+-----------+-------------+------------+
    ```
---
#### 50. Write a query in SQL to generate a report, which contain the fields movie title, name of the female actor, year of the movie, role, movie genres, the director, date of release, and rating of that movie.

- **Query:**
    ```sql
    SELECT m.mov_title,CONCAT(a.act_fname, ' ', a.act_lname) AS female_actor,m.mov_year,mc.role,g.gen_title,
    CONCAT(d.dir_fname, ' ', d.dir_lname) AS director,m.mov_dt_rel,mr.rev_stars
    FROM movie m
    JOIN movie_cast mc
    ON m.mov_id = mc.mov_id
    JOIN actor a
    ON mc.act_id = a.act_id
    JOIN movie_genres mg
    ON m.mov_id = mg.mov_id
    JOIN genres g
    ON mg.gen_id = g.gen_id
    JOIN movie_direction md
    ON m.mov_id = md.mov_id
    JOIN director d
    ON md.dir_id = d.dir_id
    JOIN movie_rating mr
    ON m.mov_id = mr.mov_id
    WHERE a.act_gender = 'F';
    ```

- **Output**
    ```
    +-------------------+------------------+----------+--------------+-----------+----------------+------------+-----------+
    | mov_title         | female_actor     | mov_year | role         | gen_title | director       | mov_dt_rel | rev_stars |
    +-------------------+------------------+----------+--------------+-----------+----------------+------------+-----------+
    | The Innocents     | Deborah Kerr     |     1961 | Miss Giddens | Horror    | Jack Clayton   | 1962-02-19 |       7.9 |
    | Princess Mononoke | Claire Danes     |     1997 | San          | Animation | Hayao Miyazaki | 2001-10-19 |       8.4 |
    | Aliens            | Sigourney Weaver |     1986 | Ripley       | Action    | James Cameron  | 1986-08-29 |       8.4 |
    +-------------------+------------------+----------+--------------+-----------+----------------+------------+-----------+

    ```