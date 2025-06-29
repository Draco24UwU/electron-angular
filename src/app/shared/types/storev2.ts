export abstract class store<T>{
    public data?: T;
    public buffer?: Record<string, T>;

    constructor(data?: T, key?: keyof T){
        if(data) this.data = data;
        if(key) this.buffer = this.ToBuffer(data!, key);
    }

    private ToBuffer(data: T, key: keyof T): Record<string, T> {
        const buffer: Record<string, T> = {};
        if(Array.isArray(data)){
            data.forEach(item => {
            const bufferKey = key 
                ? String(item[key]) 
                : this.getDefaultId(item);
            buffer[bufferKey] = item;
            });
        }else{
            const bufferKey = key 
            ? String(data[key]) 
            : this.getDefaultId(data);
            buffer[bufferKey] = data;
        }
        return buffer;
    }

    private getDefaultId(item: T): string {
    return (item as any).id 
        ?? (item as any)._id 
        ?? JSON.stringify(Object.values(item as object)[0]);
    }
 
}