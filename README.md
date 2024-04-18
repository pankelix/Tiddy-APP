# Tiddy - House Chores Manager

## Intro

An app to help with the organization of the house chores

![](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYjk5ZXEzejNiam91aDd0N3g4YXdkYjNodHcwOWllaXhxMTk2dXRidCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/NV4cSrRYXXwfUcYnua/giphy.gif)

Create a Home group, with several users that live inside the same house

Different profiles with different permissions (admin/user)

## Functional Description

### Use Cases

* Register House (all house members share the same account)
* Manage House
    - Create profile (basic role by default)
        - Assign name & pincode
        - First profile always admin
    - Manage profiles
        - Assign role to profile (admin)
        - Delete other profiles (admin)
    - Edit profile
        - Change pincode
        - Change color
        - Delete own profile
* Manage tasks
    - See and filter tasks
    - Create new tasks
    - React to tasks
        - Assign task (user to self, admin to all)
        - Complete this task (pincode needed)
        - Delay this task
        - Edit task (admin)
        - Delete task (admin)

### Views

#### House registration & Login

* House creation
    - Name
    - Rooms
    - Email & password

#### Home view

* Tasks feed
    - Default: Calendar of current week (buttons to prev and next week)
    - Filter
        - Assigned to me / all
    - Templates (go to **Templates**)
    - Stats (go to **Stats**)
    - Profile (go to **Profile views**)
    - Click on task (modal **Task reaction**)
    - Click on empty date (modal **Propose task**)
    - New task (+)
        - Create new task (go to **Templates**)
        - Propose task (modal **Propose task**)

#### Profile views

* Profile creation
    - Admin
        - Change other users profile role
        - Delete other users profile
    - User
        - Change picture
        - Change color
        - Delete own profile

#### Task reaction

* Assign this task
    - To self (user), to another users (admin)
* Complete this task
    - Pincode needed
    - Completion date (today by default)
    - It renovates automatically, according to periodicity
    - Points assignation
* Delay task (delay counter)
* Edit this task (admin)
* Delete this task (admin)

#### Task templates

* See all task templates
* Edit task
* Delete task
* Create template
    - Task name
    - Periodicity: daily, weekly (every wednesday)
    - Room/s
    - Points awarded for completion (optional)

#### Stats

* Ranking of points
* Points redeem

## Technical Description

### Data Model

Home
* id (string)
* name (string)
* email (string)
* password (string)

Room
* id (string)
* home (Home.id)
* name (string)

Profile
* id (string)
* home (Home.id)
* name (string)
* pincode (string)
* color (object)
    - name (string)
    - code (string)
* role (string)
* points (number)

Template
* id (string)
* home (Home.id)
* name (string)
* rooms ([Room.id])
* periodicity (number)
* points (number)

Task
* id (string)
* home (Home.id)
* template (Template.id)
* assignee (Profile.id)
* done (boolean)
* date (Date)
* delay (number)
* oldId (string)

## Future versions will include:

#### Store tasks (instead of deletion)

#### List of redeemable rewards

#### Alternatives to pincode

* Fingerprint
* Face scan

#### Shopping list

* See different shopping lists

* Create new list (+)
    - Blank list / Choose from templates
    - All users can add things to this list
    - Assign TO a task (optional)

* On the list
    - Save as a template
    - Activate shopping mode
        - No more additions
        - For every item choose between "checked" or "not found"
        - Not found items go directly to a new list
        - Lógica para el orden en que se hace check (las próximas veces se propondrá este orden para facilitar la compra)
        - Finalize (and add a picture of the ticket)

#### Push notifications

* Today's assigned to me tasks
* Today's free tasks

#### Quality of life

* Compatibility with assistants like Siri, Google assistant o Alexa
* Transform a picture of the ticket to text, this way budgets can be done

#### Appointments

* Addition of appointments (medical, travels, leisure...)
* Pre-made tasks according to the appointment (for example if there's a dinner at home clean living room / do groceries / clean kitchen ...)
* Ticket adding
* Notificaciones push diarias:
    - today's appointments
