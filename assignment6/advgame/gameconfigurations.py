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