import supabase from '@@/server/supabase';
import supTables from '@@/constants/supabase-tables.json';
import { HttpException, HttpStatus } from '@@/server/httpClient/HttpEntities';
const { tables } = supTables;
const cacheRequest = async (key: string, value: string) =>
	supabase
		.from(tables.CACHE.tableName)
		.upsert(
			[
				{
					[tables.CACHE.columnNames.KEY]: key,
					[tables.CACHE.columnNames.VALUE]: value,
				},
			],
			{
				onConflict: tables.CACHE.columnNames.KEY,
			}
		)
		.then(({ error }) => {
			if (error) throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
		});
export { cacheRequest };
