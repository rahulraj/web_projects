def simple_game(builder):
  return builder. \
      room(
        name='the testing room',
        description=
            """
            It's a room with a Pythonista writing test cases.
            There is a locked drawer with a key on top.
            You need to get to the production server room
            at the North exit, but management has stationed a 
            guard to to stop you.
            """
      ). \
      room(
        name='the production room',
        description='Room with production servers',
        final_room=True
      ). \
      exit(
        name='North',
        description='The north exit',
        from_room='the testing room',
        to_room='the production room',
        locked=True
      ). \
      exit(
        name='South',
        description='The south exit',
        from_room='the production room',
        to_room='the testing room',
        locked=False
      ). \
      item(
        name='TPS Report',
        description="""A report explaining how to test a text-based
                       adventure game""",
        use_message="""You read the report to the guard blocking the North.
                       He falls asleep allowing you to go through.""",
        in_room='the testing room',
        unlocks='North',
        locked=True
      ). \
      item(
        name='Drawer Key',
        description='An old metal key to the TPS report drawer',
        use_message='You put the key in the lock',
        in_room='the testing room',
        unlocks='TPS Report', locked=False
      ). \
      start_in('the testing room').build()

def save_internet_game(builder):
  return builder. \
      room(
        name='Building 7',
        description=
        """
          As anyone who has watched "The IT Crowd" knows, the Internet
        is contained entirely within a small, black, weightless box.
        It is kept in the Stata Center and watched over by elite
        Computer Science elders.

          Unfortunately, one day, a MIT Professor named Jack Danielson,
        enraged by the nth time a student asked him for help developing
        a web app without even a simple object model for planning,
        stole the Internet from the Stata Center.

          You run into Building 7, and bar the door, blocking out the angry
        rioters blaming anyone associated with MIT for the resulting
        collapse of civilization. You have taken a recording of Prof.
        Danielson's actions, and it drops from your hands onto the
        floor as you bolt the door. You must find the Internet and return
        it to its home, so that the world may be mended.
        """
      ). \
      room(
        name='Building 3',
        description=
        """
          Building 3 of MIT is deserted. The only thing there is a small
        piece of paper on which someone has scrawled a series of five numbers.
        """
      ). \
      room(
        name='Building 10 Lobby',
        description=
        """
          The lobby for Building 10. There is an elevator leading up to
        the 10-250 lecture hall, where several MIT students are hiding,
        but the elevator is locked.
        """
      ). \
      room(
        name='Building 4 Athena Cluster',
        description=
        """
          A computer cluster. With no Internet, these computers are not
        very useful...

          In the back of the room, on a desk, you see a key.
        """
      ). \
      room(
        name='Lecture Hall 10-250',
        description=
        """
          You see several students on their laptops. Professor
        Jack Danielson is standing at the front, giving a lecture.

          Interestingly, one student appears to see no issue with the idea
        of dropping nontrivial sums of money for a MIT education,
        only to spend lecture browsing Facebook on their Macbook Air.

          "How are you connected to the Internet?" you ask.
        "It's wireless, silly!" he replies.
        """
      ). \
      room(
        name='Stata Center',
        description=
        """
        You see a pedestal, where a small black box could fit...
        """
      ). \
      room(
        name='Stata Center Roof',
        description=
        """
          On this roof, you meet a hooded man.

           "I am the caretaker of the Internet, and I was rendered powerless
         as it was stolen. If it was not for your help, I might have died.
         But now you have saved us!"

          He presses a button on the wall, and the Internet lights up again.
        It shines so brightly that it can be seen from a 50 mile radius.
        The world is now back online! The rioting mobs outside quiet,
        and disperse.

          The man remarks:
        "What a delight the Internet is! If only I could be so grossly
         incadescent!"
        """,
        final_room=True
      ). \
      exit(
        name='East Doorway',
        description='The doorway from Building 7 to Building 3',
        from_room='Building 7',
        to_room='Building 3',
        locked=False
      ). \
      exit(
        name='West Doorway',
        description='The doorway from Building 3 to Building 7',
        from_room='Building 3',
        to_room='Building 7',
        locked=False
      ). \
      exit(
        name='Entry to Building 10',
        description='A wide entry into Building 10',
        from_room='Building 3',
        to_room='Building 10 Lobby',
        locked=False
      ). \
      exit(
        name='Building 10 West Exit',
        description='An exit from Building 10 to Building 3',
        from_room='Building 10 Lobby',
        to_room='Building 3',
        locked=False
      ). \
      exit(
        name='Up Elevator',
        description='The elevator in Building 10, going up from the lobby',
        from_room='Building 10 Lobby',
        to_room='Lecture Hall 10-250',
        locked=True
      ). \
      exit(
        name='Down Elevator',
        description='The elevator in Building 10, going down from 10-250',
        from_room='Lecture Hall 10-250',
        to_room='Building 10 Lobby',
        locked=False
      ). \
      exit(
        name='Door to Athena Cluster',
        description='An Athena cluster door with a combination lock',
        from_room='Building 10 Lobby',
        to_room='Building 4 Athena Cluster',
        locked=True
      ). \
      exit(
        name='Door out of Athena Cluster',
        description='The exit from the Athena cluster',
        from_room='Building 4 Athena Cluster',
        to_room='Building 10 Lobby',
        locked=False
      ). \
      exit(
        name='Hallway to Stata',
        description='A long empty hallway to the Stata Center',
        from_room='Building 10 Lobby',
        to_room='Stata Center',
        locked=False
      ). \
      exit(
        name='Hallway to Building 10',
        description='A long empty hallway leading back to Building 10',
        from_room='Stata Center',
        to_room='Building 10 Lobby',
        locked=False
      ). \
      exit(
        name='Stairs to Stata Roof',
        description='A winding staircase to the roof of the Stata Center',
        from_room='Stata Center',
        to_room='Stata Center Roof',
        locked=True
      ). \
      item(
        name='Internet',
        description='A small weightless black box. Handle with care.',
        use_message=
        """
          You place the Internet in the slot. The door to the stairs
        opens. You should go up and have it turned on.
        """,
        in_room='Lecture Hall 10-250',
        unlocks='Stairs to Stata Roof',
        locked=True
      ). \
      item(
        name='Recording',
        description=
        """
          A tape from a security camera, showing Prof. Danielson's
        theft of the Internet from the Stata center. You need this
        as evidence that he is the one responsible.
        """,
        use_message=
        """
          You brandish the tape. Prof. Danielson says, "Yes, I admit I
        stole the Internet, but you deserved it! You people shouldn't
        be allowed to write anything that runs on it until you learn
        to plan things out!" He holds up the box, running on battery
        power, and points to it as he speaks.

          You attempt to reason with him: "Yes, planning is useful, and
        people should do it more, but that doesn't justify wrecking
        the technology that holds up modern civilization!"

          The Professor remains unconvinced. At that moment, the battery
        on the Internet dies. Murmurings are heard from the crowd of students.

          "Hey! I'm getting signal not found errors!"
        They point at the Professor.
        "He's responsible! GET HIM!"

          Professor Danielson drops the Internet and runs out of the room,
        with the mob of students in hot pursuit.
        """,
        in_room='Building 7',
        unlocks='Internet',
        locked=False
      ). \
      item(
        name='Athena Cluster Combination',
        description='A piece of paper with the numbers 27182',
        use_message='You entered the combo, and opened the door.',
        in_room='Building 3',
        unlocks='Door to Athena Cluster',
        locked=False
      ). \
      item(
        name='Elevator Key',
        description='An old rusty key',
        use_message='You turned the key in the lock, opening the elevator.',
        in_room='Building 4 Athena Cluster',
        unlocks='Up Elevator',
        locked=False
      ).start_in('Building 7').build()
