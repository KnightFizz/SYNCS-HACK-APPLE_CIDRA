# pip install joycon-python hidapi pyglm
from pyjoycon import JoyCon, get_R_id
from time import sleep
joycon_id = get_R_id()
joycon = JoyCon(*joycon_id)
while 1:
    sleep(0.5)
    print(joycon.get_status())