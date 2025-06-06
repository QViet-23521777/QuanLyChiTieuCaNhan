#!/bin/bash

ROUTER_DIR="./routers"

echo "🔍 Kiểm tra cấu trúc thư mục routers..."
echo "================================================"

# Kiểm tra thư mục routers có tồn tại không
if [ -d "$ROUTER_DIR" ]; then
    echo "✅ Thư mục $ROUTER_DIR tồn tại"
    echo "📁 Nội dung thư mục:"
    ls -la "$ROUTER_DIR"
else
    echo "❌ Thư mục $ROUTER_DIR KHÔNG tồn tại"
fi

echo ""
echo "🔍 Kiểm tra từng file router..."
echo "================================"

router_files=(
    "$ROUTER_DIR/userRouter.ts"
    "$ROUTER_DIR/familyRouter.ts"
    "$ROUTER_DIR/accountRouter.ts"
    "$ROUTER_DIR/transactionRouter.ts"
    "$ROUTER_DIR/albumRouter.ts"
    "$ROUTER_DIR/photoRouter.ts"
    "$ROUTER_DIR/chatroomRouter.ts"
    "$ROUTER_DIR/messageRouter.ts"
    "$ROUTER_DIR/socialpostRouter.ts"
    "$ROUTER_DIR/reviewRouter.ts"
)

for file in "${router_files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file - Tồn tại"
        echo "   📝 TypeScript file detected"
    else
        echo "❌ $file - KHÔNG tồn tại"
    fi
done

echo ""
echo "🔍 Kiểm tra Node.js có thể import không..."
echo "=========================================="

# Test import cơ bản
node -e "
try {
    console.log('Testing require resolution...');
    const path = require('path');
    const fs = require('fs');

    const routerDir = path.resolve('$ROUTER_DIR');
    console.log('Router directory:', routerDir);

    if (fs.existsSync(routerDir)) {
        const files = fs.readdirSync(routerDir);
        console.log('Files found:', files);
    } else {
        console.log('❌ Router directory does not exist');
    }
} catch (error) {
    console.log('❌ Error:', error.message);
}
"
