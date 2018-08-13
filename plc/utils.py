

import re

# common variables

def get_addr(addr):
    
    if addr.count('DBB'):
        rawstr = r"""DB(\d+)\.DBB(\d+)"""
        compile_obj = re.compile(rawstr)
        match_obj = compile_obj.search(addr)

        # method 2: using search function (w/ external flags)
        #match_obj = re.search(rawstr, matchstr)

        # method 3: using search function (w/ embedded flags)

        if match_obj != None:
            # Retrieve group(s) from match_obj
            all_groups = match_obj.groups()

            # Retrieve group(s) by index
            db_number = int(match_obj.group(1))
            start = int(match_obj.group(2))
            return (db_number, start)
        else:
            raise(Exception)
            
    else:
            
        rawstr = r"""DB(\d+)\.DBX(\d+)\.(\d+)"""

        # method 1: using a compile object
        compile_obj = re.compile(rawstr)
        match_obj = compile_obj.search(addr)

        # method 2: using search function (w/ external flags)
        #match_obj = re.search(rawstr, matchstr)

        # method 3: using search function (w/ embedded flags)

        if match_obj is not None:
            # Retrieve group(s) from match_obj
            all_groups = match_obj.groups()

            # Retrieve group(s) by index
            db_number = int(match_obj.group(1))
            start = int(match_obj.group(2))
            bit = int(match_obj.group(3))
            return (db_number, start, bit)
        else:
            print(addr)
            #raise(Exception)