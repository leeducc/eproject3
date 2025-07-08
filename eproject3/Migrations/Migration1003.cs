namespace eproject3.Migrations;

using ServiceStack.DataAnnotations;
using ServiceStack.OrmLite;
using ServiceStack;
using ServiceStack.Data;
using System.ComponentModel;

public class Migration1003 : MigrationBase
{
    [Alias("products")]
    public class Product
    {
        [StringLength(1000)] 
        public string Description { get; set; }
    }

    public override void Up() => Db.AddColumn<Product>(x => x.Description);

    public override void Down() => Db.DropColumn<Product>(x => x.Description);
}
