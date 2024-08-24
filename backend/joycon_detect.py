from pyjoycon import JoyCon, get_L_id, get_R_id
import time

def connect_joycon():
    # Get the IDs of the left and right Joy-Cons
    joycon_left_id = get_L_id()
    joycon_right_id = get_R_id()

    if joycon_left_id and joycon_left_id[0] is not None:
        joycon_left = JoyCon(*joycon_left_id)
        print("Left Joy-Con connected.")
        return joycon_left
    elif joycon_right_id and joycon_right_id[0] is not None:
        joycon_right = JoyCon(*joycon_right_id)
        print("Right Joy-Con connected.")
        return joycon_right
    else:
        print("No Joy-Con found. Please ensure it is connected via Bluetooth or USB.")
        return None

def test_joycon_input(joycon):
    if joycon:
        try:
            while True:
                time.sleep(0.5)
                joycon_data = joycon.get_status()
                print("Buttons: ", joycon_data["buttons"])
                print("Left Stick: ", joycon_data["analog-sticks"]["left"])
                # print("Right Stick: ", joycon_data["analog-sticks"]["right"])
        except KeyboardInterrupt:
            print("Test stopped.")
    else:
        print("Joy-Con not connected.")


def joycon_state(joycon):
    return joycon.get_status()



if __name__ == "__main__":
    joycon = connect_joycon()
    test_joycon_input(joycon)
