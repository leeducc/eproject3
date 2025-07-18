namespace eproject3.ServiceInterface.Utils;

public static class SlugUtils
{
    public static string ToSlug(string text)
    {
        if (string.IsNullOrWhiteSpace(text)) return "";
        var slug = text.Trim().ToLowerInvariant();
        slug = System.Text.RegularExpressions.Regex.Replace(slug, @"[^a-z0-9\s-]", "");
        slug = System.Text.RegularExpressions.Regex.Replace(slug, @"[\s-]+", " ").Trim();
        return slug.Replace(" ", "-");
    }
}
