# Import required modules
from bs4 import BeautifulSoup
from calendar import monthrange
from datetime import datetime

def isWeekend(year, month, day):
    d = datetime(year, month, day);
    if d.weekday() > 4:
        return '  Weekend Shift'
    return '               '

employee = " Charles Wang"
year = 2022
month = 6

print('\nEmployee:' +  employee)
print('Work Schdule in: ' + str(year) + '/' + str(month) + "\n")

# Opening the html file
HTMLFile = open("test.html", "r", encoding="utf-8")
  
# Reading the file
index = HTMLFile.read()

# Creating a BeautifulSoup object and specifying the parser
S = BeautifulSoup(index, 'lxml')

with open('search.txt', 'wb') as f:
    f.writelines([a.text.encode() for a in S.find_all('div')])

# Opening the html file
SearchText = open("search.txt", "r", encoding="utf-8")
i = 0
flag = 0
found = 0
ScheduleText = ''

# Using the find_all method to find all elements of a tag
for line in SearchText:
    i += 1
    if employee in line and ',' not in line:
        flag = 1     
        if(i != 1):
            found = i+1
    if(i == found):
        ScheduleText = line
        flag = 1
        break
if flag == 1 and i != 1:
    pass
else:
    print('Employee', employee , 'Not Found in Search')

a = ScheduleText.replace('','#')
for i, status in enumerate(a.split()[5 : monthrange(year, month)[1] + 5]):
    print(i+1, isWeekend(year, month, i+1), status.replace('#',''))

print()