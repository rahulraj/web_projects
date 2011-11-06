def simple_testing_game(builder):
  return builder. \
      room(
        name='The testing room',
        description="""
            Room with a Pythonista writing test cases.
            There is a locked drawer with a key on top.
            You need to get to the production server room
            at the North exit,
            but management has stationed a guard to to stop you."""
      ). \
      room(
        name='The production room',
        description='Room with production servers',
        final_room=True
      ). \
      exit(
        name='North',
        description='The north exit',
        from_room='The testing room',
        to_room='The production room',
        locked=True
      ). \
      item(
        name='TPS Report',
        description="""A report explaining how to test a text-based
                       adventure game""",
        use_message="""You read the report to the guard blocking the North.
                       He falls asleep allowing you to go through.""",
        in_room='The testing room',
        unlocks='North',
        locked=True
      ). \
      item(
        name='Key to the TPS report drawer',
        description='An old metal key',
        use_message='You put the key in the lock',
        in_room='The testing room',
        unlocks='TPS Report', locked=False
      ). \
      start_in('The testing room').build()
