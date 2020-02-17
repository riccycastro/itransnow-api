export abstract class AbstractConverter {
  abstract convertToDto(entity: any): any;

  convertToDtoList(entities: any[]): any[] {
    const dtos: any[] = [];

    for (const entity of entities) {
      dtos.push(this.convertToDto(entity));
    }

    return dtos;
  }
}
