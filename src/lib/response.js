export function ok(data, status = 200) {
  return Response.json({ data }, { status })
}

export function err(message, status = 400) {
  return Response.json({ error: message }, { status })
}