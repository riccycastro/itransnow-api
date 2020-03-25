export interface StringIndexedByString {
  [k: string]: string
}

export interface ListResult<Entity> {
  data: Entity[],
  count: number
}
