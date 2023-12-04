"""create inital tables

Revision ID: 66a49d3eb3d5
Revises: 
Create Date: 2023-11-27 17:02:51.689224

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '66a49d3eb3d5'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('categories',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('created_at', sa.TIMESTAMP(), server_default=sa.text('CURRENT_TIMESTAMP')),
    sa.Column('category', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_categories_id'), 'categories', ['id'], unique=False)
    op.create_table('items',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.TIMESTAMP(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=True),
        sa.Column('updated_at', sa.TIMESTAMP(), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=True),
        sa.Column('quantity', sa.Integer(), server_default=sa.text('1'), nullable=True),
        sa.Column('title', sa.String(), server_default=sa.text("'No title provided'"), nullable=True),
        sa.Column('shipping_cost', sa.Float(), nullable=True),
        sa.Column('category_id', sa.Integer(), nullable=True),
        sa.Column('initial_bid_price', sa.Float(), nullable=False),
        sa.Column('final_bid_price', sa.Float(), nullable=True),
        sa.Column('seller_id', sa.Integer(), nullable=False),
        sa.Column('buyer_id', sa.Integer(), nullable=True),
        sa.Column('photo_url1', sa.String(), nullable=True),
        sa.Column('photo_url2', sa.String(), nullable=True),
        sa.Column('photo_url3', sa.String(), nullable=True),
        sa.Column('photo_url4', sa.String(), nullable=True),
        sa.Column('photo_url5', sa.String(), nullable=True),
        sa.ForeignKeyConstraint(['category_id'], ['categories.id']),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_items_id'), 'items', ['id'], unique=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_items_id'), table_name='items')
    op.drop_table('items')
    op.drop_index(op.f('ix_categories_id'), table_name='categories')
    op.drop_table('categories')
    # ### end Alembic commands ###
