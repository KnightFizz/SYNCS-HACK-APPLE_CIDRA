from pyjoycon import JoyCon, get_L_id, get_R_id
import time


def connect_joycons():
    # Get the IDs of the left and right Joy-Cons
    joycon_left_id = get_L_id()
    joycon_right_id = get_R_id()

    joycon_left = None
    joycon_right = None

    if joycon_left_id and joycon_left_id[0] is not None:
        joycon_left = JoyCon(*joycon_left_id)
        print("Left Joy-Con connected.")

    if joycon_right_id and joycon_right_id[0] is not None:
        joycon_right = JoyCon(*joycon_right_id)
        print("Right Joy-Con connected.")

    if not joycon_left and not joycon_right:
        print("No Joy-Con found. Please ensure they are connected via Bluetooth or USB.")

    return joycon_left, joycon_right


def test_joycon_input(joycon_left, joycon_right):
    if joycon_left or joycon_right:
        try:
            while True:
                time.sleep(2)

                if joycon_left:
                    joycon_left_data = joycon_left.get_status()
                    print("Left Joy-Con Buttons: ", joycon_left_data["buttons"])
                    print("Left Joy-Con Stick: ", joycon_left_data["analog-sticks"]["left"])

                if joycon_right:
                    joycon_right_data = joycon_right.get_status()
                    print("Right Joy-Con Buttons: ", joycon_right_data["buttons"])
                    print("Right Joy-Con Stick: ", joycon_right_data["analog-sticks"]["right"])

        except KeyboardInterrupt:
            print("Test stopped.")
    else:
        print("No Joy-Cons connected.")


if __name__ == "__main__":
    joycon_left, joycon_right = connect_joycons()
    test_joycon_input(joycon_left, joycon_right)
