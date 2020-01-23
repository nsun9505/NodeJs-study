var members = ['test', 'test2', 'test3'];

console.log(members[1]);
for(i=0; i<members.length; i++)
 console.log(members[i])

var roles = {
    'programer':'test',
    'designer':'test2',
    'manager':'test3'
}

// name = key
for(var name in roles)
    console.log(roles[name]);

console.log(roles.designer);