import { newModel, StringAdapter } from "casbin";

export const model = newModel(`
[request_definition]
r = sub, obj, act

[policy_definition]
p = sub, obj, act, eft

[role_definition]
g = _, _

[policy_effect]
e = some(where (p.eft == allow)) && !some(where (p.eft == deny))

[matchers]
m = g(r.sub, p.sub) && keyMatch(r.obj, p.obj) && regexMatch(r.act, p.act)
`);

export const adapter = new StringAdapter(`


p, SUPER_ADMIN, admins, (list)|(create)

p, ADMIN, assignments, (list)|(create)
p, ADMIN, assignments/*, (edit)|(show)|(delete)
p, ADMIN, assignment/*, (edit)|(show)|(delete)

p, ADMIN, users, (list)|(create)
p, ADMIN, users/*, (edit)|(show)|(delete)
p, ADMIN, user/*, (edit)|(show)|(delete)

p, ADMIN, admins, (list)|(create)
p, ADMIN, admins/*, (edit)|(show)|(delete)
p, ADMIN, admin/*, (edit)|(show)|(delete)

`);
