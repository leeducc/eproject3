using ServiceStack;
using eproject3.ServiceModel;

namespace eproject3.ServiceInterface;

public class TodosServices(IAutoQueryData autoQuery) : Service
{
    static readonly PocoDataSource<Todo> Todos = PocoDataSource.Create(new Todo[]
    {
        new () { Id = 1, Text = "Learn" },
        new () { Id = 2, Text = "React", IsFinished = true },
        new () { Id = 3, Text = "Vite!" },
    }, nextId: x => x.Select(e => e.Id).Max());

    public object Get(QueryTodos query)
    {
        var db = Todos.ToDataSource(query, Request);
        return autoQuery.Execute(query, autoQuery.CreateQuery(query, Request, db), db);
    }

    public Todo Post(CreateTodo request)
    {
        var newTodo = new Todo { Id = Todos.NextId(), Text = request.Text };
        Todos.Add(newTodo);
        return newTodo;
    }

    public Todo Put(UpdateTodo request)
    {
        var todo = request.ConvertTo<Todo>();
        Todos.TryUpdateById(todo, todo.Id);
        return todo;
    }

    // Handles Deleting the Todo item
    public void Delete(DeleteTodo request) => Todos.TryDeleteById(request.Id);

    public void Delete(DeleteTodos request) => Todos.TryDeleteByIds(request.Ids);
}
