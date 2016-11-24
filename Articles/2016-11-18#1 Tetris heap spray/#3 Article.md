Alternating sizes
-----------------
This gets even better if you allocate alternating large and small blocks and
then free the large blocks before allocating an even larger one. For example,
if you allocate a total of 10 blocks of alternating 9999 and 1 bytes, then free
the larger blocks before allocating 10000 bytes, you will end up having 10005
bytes allocated in 6 blocks, 5 of these containing only 1 byte and one
containing 10000 bytes. That last block start at an address 50000 bytes away
from the first block.
