export interface SidebarItem {
    id: number;
    label: string;
    items: Items[],
}
interface Items {
    id: number;
    label: string;
    total: number;
    checked: boolean;
    items: Items[]

}