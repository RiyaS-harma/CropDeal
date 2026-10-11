namespace CaseStudyCropDeal.Services;

public interface IConfigurationService
{
    Task<string> GetConfigurationAsync(string key);
    Task SetConfigurationAsync(string key, string value);
}

public class ExternalConfigurationService : IConfigurationService
{
    private readonly HttpClient _httpClient;
    private readonly string _configServerUrl;

    public ExternalConfigurationService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _configServerUrl = configuration["ConfigServer:Url"] ?? "http://localhost:8888";
    }

    public async Task<string> GetConfigurationAsync(string key)
    {
        try
        {
            var response = await _httpClient.GetAsync($"{_configServerUrl}/config/{key}");
            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadAsStringAsync();
            }
        }
        catch
        {
            // Fallback to local configuration
        }
        
        return string.Empty;
    }

    public async Task SetConfigurationAsync(string key, string value)
    {
        try
        {
            var content = new StringContent(value, System.Text.Encoding.UTF8, "application/json");
            await _httpClient.PostAsync($"{_configServerUrl}/config/{key}", content);
        }
        catch
        {
            // Handle error
        }
    }
}