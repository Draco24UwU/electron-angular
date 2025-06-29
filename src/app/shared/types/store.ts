type UnwrapArray<T> = T extends Array<infer U> ? U : T;

class Basestore<T>{
  private static counter = 0;
  private $id: number | null = null;
  private $data: T | null = null;
  private $key: keyof UnwrapArray<T> | null = null;
  private $loading: boolean = false;
  private $buffer: Record<string, UnwrapArray<T>> | null = null;

  constructor(data?: T, key?: keyof UnwrapArray<T>){
      if(data) this.$data = data;
      if(data) this.$buffer = this.toBuffer(data, key);
      if(key) this.$key = key;
      this.$id = Basestore.counter++;
  }

  private toBuffer(data: T, key?: keyof UnwrapArray<T>): Record<string, UnwrapArray<T>> {
    const buffer: Record<string, UnwrapArray<T>> = {};
    if(Array.isArray(data)){
        data.forEach(item => {
        const bufferKey = key 
            ? String(item[key]) 
            : this.getDefaultId(item);
        buffer[bufferKey] = item;
        });
    }else{
        const bufferKey = key 
        ? String((data as unknown as UnwrapArray<T>)[key]) 
        : this.getDefaultId(data as unknown as UnwrapArray<T>);
        buffer[bufferKey] = data as unknown as UnwrapArray<T>;
    }
    return buffer;
  }
  private getDefaultId(item: UnwrapArray<T>): string {
    const key = (item as any).id 
    ?? (item as any)._id 
    ?? Object.values(item as object)[0];
    this.$key = key as keyof UnwrapArray<T>;
    return key;
  }
  public values(){
    return Object.keys(this).reduce((acc, key) => {
        acc[key] = (this as any)[key];
        return acc;
    }, {} as Record<string, any>);
  }

  public set data(d: T){
    this.$data = d;
    this.$buffer = this.toBuffer(d);
  }
  public get data(): T | null{
    return this.$data;
  }
  public set key(k: keyof UnwrapArray<T>) {
    this.$key = k;
    if (this.$data) {
        this.$buffer = this.toBuffer(this.$data, k);
    }
  }
  public get key(): keyof UnwrapArray<T> | null {
    return this.$key;
  }
  public get loading(): boolean {
    return this.$loading;
  }
  public set loading(l: boolean){
    this.$loading = l;
  }
  public get buffer(){
    return this.$buffer;
  }
}

export const store = <T extends any>(data?: T, key?: keyof UnwrapArray<T>) => {
    return new Basestore<T>(data, key);
}



