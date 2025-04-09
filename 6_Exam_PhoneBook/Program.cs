using _6_Exam_PhoneBook.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace _6_Exam_PhoneBook
{
    /*���� ��������� ������� ���������� � ����� � ���������.
         * ������ ������� ����� ����� ��������� ���������.
         * �������� ������� �� ��������� ���������:
         *      �����, ������, ������, ������.
         * ���� ����� ����. �������:
         *      �������� (CRUD) + details ��� ��������.
         *      �������� (CRUD) + details ��� ��������.
         *      ��������� (CRUD)
         *      ����� �� �����
         *      ����� �� ��������
         *      ���������� �� ����������
         * ����������:
         *      ������� �������
         *      MUI
         *      ������ �������� ��� ������ ������
         *      ������������ �������
         *      ������ ASPNET webApi
         *      ������������� NG, ������� ����
         *      Scaffold-DbContext "Server=.\MSSQLSERVER2019;Database=NG_Exam_PhoneBook;Trusted_Connection=True;TrustServerCertificate=True" Microsoft.EntityFrameworkCore.SqlServer -OutputDir Models -ContextDir Data -DataAnnotations
         */
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            builder.Services.AddControllersWithViews();

            //builder.Services.AddCors();

            builder.Services.AddDbContext<NgExamPhoneBookContext>
             (options => options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            // ��������� ��������� �������
            builder.Services.AddAuthentication(option =>
            {
                option.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                option.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                option.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.SaveToken = true;
                options.RequireHttpsMetadata = true;
                options.TokenValidationParameters = new TokenValidationParameters()
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidIssuer = builder.Configuration["Jwt:Site"],
                    ValidAudience = builder.Configuration["Jwt:Site"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:SigningKey"]!))
                };
            });

            builder.Services.AddAuthorization(options =>
            {
                options.AddPolicy("AdminPolicy", policy =>
                {
                    policy.RequireUserName("admin");
                });
            });

            var app = builder.Build();

            //app.UseCors(builder => builder.AllowAnyOrigin());

            // Configure the HTTP request pipeline.
            if (!app.Environment.IsDevelopment())
            {
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseRouting();

            app.UseAuthentication();   // ���������� middleware �������������� 
            app.UseAuthorization();   // ���������� middleware ����������� 


            app.MapControllerRoute(
                name: "default",
                pattern: "{controller}/{action=Index}/{id?}");

            app.MapFallbackToFile("index.html");

            app.Run();
        }
    }
}