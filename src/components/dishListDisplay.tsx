
type DishListProps = {
  List: Dish[];
};

export default function DishList({ List } : DishListProps) {
    return (
        <div>
            {List.map((dish, i) => (
                <span key={dish.id}>{dish.names}</span>
            ))}
        </div>
    )
}