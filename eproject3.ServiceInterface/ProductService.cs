namespace eproject3.ServiceInterface;

// Services/ProductService.cs
using ServiceStack;
using ServiceStack.OrmLite;
using eproject3.ServiceModel.Types;
using eproject3.ServiceModel;

public class ProductService : Service
{
    public async Task<Product> Post(CreateProduct request)
    {
        var product = request.ConvertTo<Product>();
        product.Id = (int)await Db.InsertAsync(product, selectIdentity: true);
        return product;
    }

    public async Task<Product> Put(UpdateProduct request)
    {
        var product = request.ConvertTo<Product>();
        await Db.UpdateAsync(product);
        return product;
    }

    public async Task Delete(DeleteProduct request)
    {
        await Db.DeleteByIdAsync<Product>(request.Id);
    }

    public async Task<Product> Get(GetProduct request)
    {
        return await Db.SingleByIdAsync<Product>(request.Id)
               ?? throw HttpError.NotFound("Product not found");
    }

    public async Task<List<Product>> Get(SearchProducts request)
    {
        var q = Db.From<Product>();

        if (!string.IsNullOrEmpty(request.Category))
            q.Where(x => x.Category == request.Category);

        if (!string.IsNullOrEmpty(request.Query))
            q.Where(x => x.Title.Contains(request.Query) || x.Artist.Contains(request.Query));

        if (request.SortBy == "asc")
            q.OrderBy(x => x.Price);
        else if (request.SortBy == "desc")
            q.OrderByDescending(x => x.Price);
        else // newest
            q.OrderByDescending(x => x.Id);

        int offset = (request.Page - 1) * request.PageSize;
        q.Limit(offset, request.PageSize);


        return await Db.SelectAsync(q);
    }
}
