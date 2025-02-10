import datetime
import os

from aiogram import Bot
import asyncio
import asyncpg
from dotenv import load_dotenv

load_dotenv(dotenv_path='config/.env')
BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
DB_HOST=os.getenv('DB_HOST')
DB_PORT=os.getenv('DB_PORT')
DB_USER=os.getenv('DB_USER')
DB_PASS=os.getenv('DB_PASS')
DB_NAME=os.getenv('DB_NAME')

currrent_date = datetime.date.today()


async def notifications(bot: Bot):
    try:
        conn = await asyncpg.connect(
            host=DB_HOST,
            database=DB_NAME,
            user=DB_USER,
            password=DB_PASS,
            port=DB_PORT
        )
        
        async with conn.transaction():
            admins = await conn.fetch("SELECT * FROM \"User\" WHERE status = 'admin';")
            
            data = await conn.fetch("SELECT * FROM \"AirReturn\" WHERE is_end is FALSE;")
            for air_return in data:
                days_for_return = (air_return[3] + datetime.timedelta(days=13) - currrent_date).days
                market = await conn.fetch(f"SELECT name FROM \"Market\" WHERE id = {air_return[-1]}")
                if days_for_return <= 3:
                    for admin in admins:
                        await bot.send_message(admin[0], f'Незавершенный возврат (воздух):\nДата продажи: {air_return[3].isoformat()}\nДата возврата: {air_return[4].isoformat()}\nДней до возврата: {days_for_return}\nЦена: {air_return[6]}\nМагазин-посредник: {air_return[7]}\nПричина возврата: {air_return[8]}\nМагазин: {market[0]["name"]}')

            data = await conn.fetch("SELECT * FROM \"Return\" WHERE is_end is FALSE;")
            for normal_return in data:
                days_for_return = (normal_return[3] + datetime.timedelta(days=13) - currrent_date).days
                market = await conn.fetch(f"SELECT name FROM \"Market\" WHERE id = {normal_return[-1]}")
                if days_for_return <= 3:
                    for admin in admins:
                        await bot.send_message(admin[0], f'Незавершенный возврат:\nДата продажи: {normal_return[3].isoformat()}\nДата возврата: {normal_return[4].isoformat()}\nДней до возврата: {days_for_return}\nЦена: {normal_return[6]}\nПричина возврата: {normal_return[7]}\nМагазин: {market[0]["name"]}')

            data = await conn.fetch("SELECT * FROM \"Detail\" WHERE amount = 0;")
            for detail in data:
                market = await conn.fetch(f"SELECT name FROM \"Market\" WHERE id = {detail[-1]}")
                for admin in admins:
                    await bot.send_message(admin[0], f"На складе закончилась деталь:\n{detail['name']}, VIN: {detail['vin']}, магазин: {market[0]['name']}")
                    
            
            workers = await conn.fetch("SELECT * FROM \"User\" WHERE status = 'worker';")
            
            for worker in workers:
                workers_market = await conn.fetch(f"SELECT market_id FROM \"MarketUserMapper\" \
                                                    JOIN \"Market\" ON \"Market\".id = market_id \
                                                    WHERE user_id = {worker[0]};")
                
                data = await conn.fetch(f"SELECT * FROM \"AirReturn\" WHERE is_end is FALSE AND market_id = {workers_market[0]['market_id']};")
                for air_return in data:
                    days_for_return = (air_return[3] + datetime.timedelta(days=13) - currrent_date).days
                    market = await conn.fetch(f"SELECT name FROM \"Market\" WHERE id = {air_return[-1]}")
                    if days_for_return <= 3:
                        await bot.send_message(worker[0], f'Незавершенный возврат (воздух):\nДата продажи: {air_return[3].isoformat()}\nДата возврата: {air_return[4].isoformat()}\nДней до возврата: {days_for_return}\nЦена: {air_return[6]}\nМагазин: {air_return[7]}\nПричина возврата: {air_return[8]}')

                data = await conn.fetch(f"SELECT * FROM \"Return\" WHERE is_end is FALSE AND market_id = {workers_market[0]['market_id']};")
                for normal_return in data:
                    days_for_return = (normal_return[3] + datetime.timedelta(days=13) - currrent_date).days
                    market = await conn.fetch(f"SELECT name FROM \"Market\" WHERE id = {normal_return[-1]}")
                    if days_for_return <= 3:
                        await bot.send_message(worker[0], f'Незавершенный возврат:\nДата продажи: {normal_return[3].isoformat()}\nДата возврата: {normal_return[4].isoformat()}\nДней до возврата: {days_for_return}\nЦена: {normal_return[6]}\nПричина возврата: {normal_return[7]}')

                data = await conn.fetch(f"SELECT * FROM \"Detail\" WHERE amount = 0 AND market_id = {workers_market[0]['market_id']};")
                for detail in data:
                    market = await conn.fetch(f"SELECT name FROM \"Market\" WHERE id = {detail[-1]};")
                    await bot.send_message(worker[0], f"На складе закончилась деталь:\n{detail['name']}, VIN: {detail['vin']}")

    except Exception as e:
        print(f"Ошибка подключения к базе данных: {e}")
    finally:
        await conn.close()


async def main():
    bot = Bot(token=BOT_TOKEN)
    try:
        await notifications(bot)
    except Exception as e:
        print(e)
    await bot.session.close()
    

if __name__ == '__main__':
    asyncio.run(main())
