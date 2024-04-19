package com.cs122b.fabflix.repository;

import com.cs122b.fabflix.params.SortOrder;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class Query {

    public static class Builder {
        private final Connection conn;
        private final List<Object> params;
        private String selectStatement;

        private final List<String> whereConditions;

        private List<String> sortColumns;
        private SortOrder sortOrder;
        private Integer offset;
        private Integer limit;

        public Builder (Connection conn) {
            this.conn = conn;
            whereConditions = new ArrayList<>();
            params = new ArrayList<>();
        }

        public Builder select(String selectStatement) {
            this.selectStatement = selectStatement;
            return this;
        }


        // For now all of them will be and logic
        public Builder where(String column, String operator, Object value) {
            whereConditions.add(String.format("%s %s ?", column, operator));
            params.add(value);
            return this;
        }
        public Builder setOffset(int value) {
            offset = value;
            return this;
        }
        public Builder setLimit(int value) {
            limit = value;
            return this;
        }


        public Builder orderBy(List<String> fields, SortOrder order) {
            if (fields == null || fields.isEmpty()) {
                return this;
            }


            this.sortColumns = fields;
            this.sortOrder = order;
            return this;
        }



        public Query build() throws SQLException {
            if (selectStatement == null) {
                throw new IllegalStateException("select must be set");
            }

            StringBuilder query = new StringBuilder();

            String whereClause = createWhereClause(whereConditions);
            query.append(whereClause);

            // Add select statement

            // Add clauses
            query.append(selectStatement);
            query.append(createWhereClause(whereConditions));
            query.append(createOrderByClause(sortColumns, sortOrder));
            query.append(createLimitClause(limit));
            query.append(createOffsetClause(offset));
            String queryString = query.toString();
            // Create the prepared statement
            PreparedStatement stmt = conn.prepareStatement(queryString);


            // Populate the parameters
            int i = 1;
            for (Object param : params) {
                if (param instanceof Integer) {
                    stmt.setInt(i++, (Integer) param);
                } else if (param instanceof String) {
                    stmt.setString(i++, (String) param);
                } else if (param instanceof Float) {
                    stmt.setFloat(i++, (Float) param);
                } else {
                    throw new IllegalArgumentException("unsupported type");
                }
            }

            return new Query(stmt);
        }

        String createOrderByClause(List<String> sortColumns, SortOrder sortOrder) {
            if (sortOrder == null) {
                sortOrder = SortOrder.ASCENDING;
            }

            String orderString = sortOrder == SortOrder.ASCENDING ? "ASC" : "DESC";
            return String.format(
                    "ORDER BY %s %s",
                    String.join(", ", sortColumns),
                    orderString
            );
        }


        String createWhereClause(List<String> whereConditions) {
            return String.join(" AND \n", whereConditions);
        }


        String createOffsetClause(Integer offset) {
            if (offset == null) {
                return "\n";
            }
            return String.format("OFFSET %d\n", offset);
        }

        String createLimitClause(Integer limit) {
            if (limit == null) {
                return "\n";
            }
            return String.format("LIMIT %d\n", limit);
        }
    }


    private final PreparedStatement statement;
    private Query(PreparedStatement statement) {
        this.statement = statement;
    }

    public PreparedStatement getStatement() {
        return statement;
    }
}
